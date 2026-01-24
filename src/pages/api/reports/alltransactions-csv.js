import dbConnect from "@/lib/mongoose";
import Transaction from "@/models/Transaction";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    await dbConnect();

    try {
        const {
            search = "",
            scenario = "All",
            status = "All",
            deliveryStatus = "All",
            fromDate,
            toDate,
        } = req.query;

        const query = {};

        /* ===============================
           Search filter
        =============================== */
        if (search && search.trim()) {
            query.$or = [
                { name: { $regex: search.trim(), $options: "i" } },
                { phone: { $regex: search.trim(), $options: "i" } },
                { refId: { $regex: search.trim(), $options: "i" } },
            ];
        }

        /* ===============================
           Scenario filter
        =============================== */
        if (scenario && scenario !== "All") {
            query.scenario = scenario;
        }

        /* ===============================
           Transaction status filter
        =============================== */
        if (status && status !== "All") {
            query.status = status;
        }

        /* ===============================
           Delivery status filter
        =============================== */
        if (deliveryStatus && deliveryStatus !== "All") {
            query.giftDeliveryStatus = deliveryStatus;
        }

        /* ===============================
           Date filter (IST safe)
        =============================== */
        if (fromDate || toDate) {
            query.createdAt = {};

            if (fromDate) {
                query.createdAt.$gte = new Date(`${fromDate}T00:00:00.000+05:30`);
            }

            if (toDate) {
                query.createdAt.$lte = new Date(`${toDate}T23:59:59.999+05:30`);
            }
        }

        /* ===============================
           Fetch all matching records
        =============================== */
        const transactions = await Transaction.find(query)
            .sort({ createdAt: -1 })
            .lean();

        /* ===============================
           CSV Header
        =============================== */
        const headers = [
            "Ref ID",
            "Customer Name",
            "Mobile",
            "Amount",
            "Type",
            "Scenario",
            "Transaction Status",
            "Delivery Status",
            "Delivery Details",
            "Order ID",
            "Payment ID",
            "Remarks",
            "Created At (IST)",
        ];

        const rows = [headers];

        /* ===============================
           CSV Rows
        =============================== */
        transactions.forEach((txn) => {
            rows.push([
                txn.refId || "",
                txn.name || "",
                txn.phone || "",
                txn.amount || "",
                txn.type || "",
                txn.scenario || "",
                txn.status || "",
                txn.giftDeliveryStatus || "",
                txn.giftDeliveryDetails || "",
                txn.orderId || "",
                txn.paymentId || "",
                txn.remarks || "",
                txn.createdAt
                    ? new Date(txn.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                    })
                    : "",
            ]);
        });

        /* ===============================
           Convert to CSV string
        =============================== */
        const csvContent = rows
            .map((row) =>
                row
                    .map((val) =>
                        `"${String(val).replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        /* ===============================
           Send file
        =============================== */
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=transactions_${Date.now()}.csv`
        );

        return res.status(200).send(csvContent);
    } catch (error) {
        console.error("CSV Export Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to export CSV",
        });
    }
}
