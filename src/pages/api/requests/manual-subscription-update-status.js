import crypto from "crypto";
import dbConnect from "@/lib/mongoose";

// ✅ IMPORTANT: import models to register them in Next.js runtime
import Customer from "@/models/Customer";
import Plan from "@/models/Plan";
import Transaction from "@/models/Transaction";
import ManualSubscriptionRequest from "@/models/ManualSubscriptionRequest";

/* ================================
   Wallet credit helper (ledger)
================================ */
async function creditWalletWithLedger({
    customer,
    amount,
    scenario,
    remarks,
    refId = null,
    planId = null,
}) {
    if (!amount || amount <= 0) return;

    const freshCustomer = await Customer.findById(customer._id);
    const newWalletBalance = (freshCustomer.walletAmount || 0) + amount;

    let finalRefId = refId;

    try {
        await Transaction.create({
            userId: customer._id,
            refId: finalRefId,
            name: freshCustomer.fullName || freshCustomer.email || "Unknown",
            phone: freshCustomer.phone || null,
            amount,
            walletAmount: newWalletBalance,
            type: "credit",
            scenario,
            status: "success",
            planId,
            remarks,
        });
    } catch (err) {
        // If duplicate refId, generate random 5 digits and retry
        if (err.code === 11000 && refId) {
            const random5 = Math.floor(10000 + Math.random() * 90000);
            finalRefId = `${refId}_${random5}`;

            await Transaction.create({
                userId: customer._id,
                refId: finalRefId,
                name: freshCustomer.fullName || freshCustomer.email || "Unknown",
                phone: freshCustomer.phone || null,
                amount,
                walletAmount: newWalletBalance,
                type: "credit",
                scenario,
                status: "success",
                planId,
                remarks,
            });
        } else {
            throw err;
        }
    }

    // Update wallet AFTER successful ledger entry
    await Customer.findByIdAndUpdate(customer._id, {
        $inc: { walletAmount: amount },
    });
}

export default async function handler(req, res) {
    await dbConnect();

    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { requestId, status, remarks } = req.body;

        if (!requestId || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid request (requestId, status required)",
            });
        }

        // =========================
        // Load manual request
        // =========================
        const manualReq = await ManualSubscriptionRequest.findById(requestId);
        if (!manualReq) {
            return res.status(404).json({ success: false, message: "Request not found" });
        }

        // prevent double processing
        if (manualReq.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: `Request already processed (${manualReq.status})`,
            });
        }

        // Reject flow
        if (status === "rejected") {
            manualReq.status = "rejected";
            manualReq.adminRemarks = remarks || "Rejected by admin";
            await manualReq.save();

            return res.status(200).json({
                success: true,
                message: "Request rejected successfully",
            });
        }

        // =========================
        // APPROVE FLOW
        // =========================

        // UTR is payment id (as you said)
        const utr = (manualReq.utrNumber || "").trim();
        if (!utr) {
            return res.status(400).json({ success: false, message: "UTR number missing in request" });
        }

        const customerId = manualReq.userId;
        const planId = manualReq.planId;

        if (!customerId || !planId) {
            return res.status(400).json({ success: false, message: "Missing userId/planId in request" });
        }

        // Fetch plan
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(400).json({ success: false, message: "Invalid plan" });
        }

        // Fetch customer (before update for referral logic)
        const customerBeforeUpdate = await Customer.findById(customerId);
        if (!customerBeforeUpdate) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        // =========================
        // Update customer subscription
        // =========================
        const updatedCustomer = await Customer.findByIdAndUpdate(
            customerId,
            {
                planId: plan._id,
                planName: plan.planName,
                planPrice: plan.price,
                earningType: plan.earningType,
                captchaPerDay: plan.captchaPerDay || 0,
                minimumEarningPerDay: plan.minimumEarningPerDay || 0,
                referralPerLogin: plan.referralPerLogin || 0,
                referrals: plan.referrals || [],
                slabs: plan.slabs || [],
                subscriptionStatus: "active",
                razorpayPaymentId: utr,
                lastSettledPlanId: plan._id,
            },
            { new: true }
        );
        console.log(updatedCustomer);
        // =========================
        // Record "PAID" transaction (debit)
        // =========================
        // Create a stable refId to avoid duplicate debits if API is called again
        const txRefId = `MANUAL_SUB_${manualReq._id.toString()}`;

        // Prevent duplicate transaction creation
        const existingDebit = await Transaction.findOne({
            userId: customerId,
            scenario: "subscription",
            type: "debit",
            refId: txRefId,
            status: "success",
        }).lean();

        if (!existingDebit) {
            await Transaction.create({
                userId: customerId,
                name: updatedCustomer.fullName || updatedCustomer.email || "Unknown User",
                phone: updatedCustomer.phone || null,
                amount: plan.price,
                type: "debit",
                scenario: "subscription",
                status: "success",
                paymentId: utr, // ✅ UTR as payment id
                orderId: null,
                refId: txRefId,
                planId,
                remarks: `${plan.planName} subscription activated (Manual UTR: ${utr})`,
            });
        }

        // =========================
        // Referral reward + milestones + gift logic
        // (same logic as your Razorpay flow)
        // =========================
        if (
            customerBeforeUpdate.subscriptionStatus === "none" &&
            customerBeforeUpdate.referredBy &&
            !customerBeforeUpdate.referralRewarded
        ) {
            const referrer = await Customer.findById(customerBeforeUpdate.referredBy);

            if (referrer) {
                const newCount = await Customer.countDocuments({
                    referredBy: referrer._id,
                    subscriptionStatus: "active",
                    planName: plan.planName,
                });

                // Base referral reward
                const referralReward = Number(plan.referralPerLogin) || 0;

                await creditWalletWithLedger({
                    customer: referrer,
                    amount: referralReward,
                    scenario: "referral",
                    remarks: `Referral reward for ${plan.planName}`,
                    refId: customerBeforeUpdate._id.toString(),
                    planId: plan._id,
                });

                await Customer.findByIdAndUpdate(referrer._id, {
                    $inc: {
                        "referralStatus.totalEarnings": referralReward,
                        "referralStatus.totalReferred": 1,
                    },
                });

                await Customer.findByIdAndUpdate(customerBeforeUpdate._id, {
                    referralRewarded: true,
                });

                // Milestone logic
                const nextMilestone = plan.referrals
                    ?.filter((r) => r.count >= newCount)
                    .sort((a, b) => a.count - b.count)[0];

                if (nextMilestone && newCount === nextMilestone.count) {
                    const milestoneKey = `MILESTONE_${plan.planName}-${nextMilestone.count}_${Date.now()}`;

                    const milestoneAmount = Number(nextMilestone.amount) || 0;

                    const freshReferrer = await Customer.findById(referrer._id);

                    if (
                        !freshReferrer.referralStatus?.milestonesAchieved?.includes(milestoneKey)
                    ) {
                        await creditWalletWithLedger({
                            customer: referrer,
                            amount: milestoneAmount,
                            scenario: "referral_bonus",
                            remarks: `Milestone bonus for ${plan.planName} (${nextMilestone.count} referrals)`,
                            refId: milestoneKey,
                            planId: plan._id,
                        });

                        await Customer.findByIdAndUpdate(referrer._id, {
                            $inc: {
                                "referralStatus.totalEarnings": milestoneAmount,
                                "referralStatus.bonusAmount": milestoneAmount,
                            },
                            $addToSet: {
                                "referralStatus.milestonesAchieved": milestoneKey,
                            },
                        });

                        // Gift logic
                        if (nextMilestone.gift) {
                            const giftDoc = {
                                planName: plan.planName,
                                milestoneCount: nextMilestone.count,
                                giftName: nextMilestone.gift,
                                status: "pending",
                                claimedAt: new Date(),
                            };

                            const updatedReferrer = await Customer.findByIdAndUpdate(
                                referrer._id,
                                { $push: { claimedGifts: giftDoc } },
                                { new: true }
                            );

                            const claimedGift =
                                updatedReferrer.claimedGifts[updatedReferrer.claimedGifts.length - 1];

                            await Transaction.create({
                                userId: referrer._id,
                                name: freshReferrer.fullName || freshReferrer.email || "Unknown",
                                phone: freshReferrer.phone || null,
                                amount: 0,
                                walletAmount: freshReferrer.walletAmount,
                                type: "credit",
                                scenario: "gift_claim",
                                giftClaimId: claimedGift._id,
                                status: "success",
                                refId: milestoneKey,
                                planId: plan._id,
                                remarks: `Gift awarded: ${nextMilestone.gift}`,
                                giftDeliveryStatus: "pending",
                                giftDeliveryHistory: [
                                    { status: "pending", remarks: "Gift created", at: new Date() },
                                ],
                            });
                        }
                    }
                }
            }
        }

        // =========================
        // Update manual request status
        // =========================
        manualReq.status = "approved";
        manualReq.adminRemarks = remarks || "Approved by admin";
        manualReq.activatedAt = new Date();
        await manualReq.save();

        // =========================
        // Response
        // =========================
        const isUpgrade =
            customerBeforeUpdate.subscriptionStatus === "active" &&
            Number(customerBeforeUpdate.planPrice || 0) < Number(plan.price || 0);

        return res.status(200).json({
            success: true,
            message: isUpgrade
                ? `Plan upgraded to ${plan.planName} successfully (Manual)`
                : `${plan.planName} activated successfully (Manual)`,
            customer: updatedCustomer,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}
