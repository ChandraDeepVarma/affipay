'use client'

import { useEffect, useState, useRef } from "react"
import { Form,Button } from "react-bootstrap"
import Swal from "sweetalert2";

const PartnersList = () => {
    const [partner, setPartner]= useState([]);

    const [formData, setFormData]= useState({
        partnername:'',
        rating: ''
    })
    const canSubmit = formData.partnername.trim() && formData.rating;
    const fileInputRef = useRef(null);


    useEffect(()=>{
        const fetchPartners= async()=>{
            try {
                const res = await fetch(`/api/users/partnerslist`);
                if(res.ok){
                    const data = await res.json();
                    setPartner(data)
                }else{
                    Swal.fire({
                        icon:'error',
                        title:'Error',
                        text:'Partners Not Fetched from server'
                    })
                }
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: "error",
                    title: "Unexpected Error",
                    text: "An unexpected error occurred. Please try again later.",
                    confirmButtonColor: "#d33"
                });
            }
        };
        fetchPartners();
    },[])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit =async(e)=>{
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("partnername", formData.partnername);
            formDataToSend.append("rating", formData.rating);
            if (formData.image) formDataToSend.append("image", formData.image);

            const res = await fetch('/api/users/partnerslist', {
            method: 'POST',
            body: formDataToSend,
            });

            let data;
               try {
                 data = await res.json();
               } catch {
                 data = {};
               }
            if (res.ok) {
                // Clear form
            setFormData({ partnername:'', rating: '', image:null });
            if (fileInputRef.current) {
                fileInputRef.current.value = "";  // reset file input manually
            }
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Partner created successfully",
                timer: 2000,
                showConfirmButton: false
            });
            } else {
                Swal.fire({
                icon: "error",
                title: "Error",
                text: data.message || "Failed to add Partner",
                confirmButtonColor: "#d33"
            });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
            icon: "error",
            title: "Unexpected Error",
            text: "An unexpected error occurred. Please try again later.",
            confirmButtonColor: "#d33"
         });
        }
    }
  return (
    <>
    <div className="card h-100 p-0 radius-12 overflow-hidden">
        <div className="card-body p-40 ">
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                <Form.Label>Partner Image</Form.Label>
                <Form.Control
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setFormData({
                    ...formData,
                    image: e.target.files[0]   // store file object
                    })}
                />
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Partner Name</Form.Label>
                <Form.Control 
                    name="partnername" 
                    value={formData.partnername}
                    onChange={handleChange} 
                    required 
                    placeholder="Enter Partner's Name"/>
                </Form.Group>

                <Form.Group className="mb-3">
                <Form.Label>Partner Rating</Form.Label>
                <Form.Control 
                    type="number" 
                    step="0.1"                // allow decimals like 3.5, 4.2
                    min="0.1"                 // minimum rating
                    max="5"     
                    name="rating" 
                    value={formData.rating}
                    onChange={(e) => {
                        let value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                            // Ensure max 5 and min 0.1
                            if (value < 0.1) value = 0.1;
                            if (value > 5) value = 5;
                            // Store as 1 decimal (e.g. 3 -> 3.0)
                            setFormData({
                                ...formData,
                                rating: value.toFixed(1)
                            });
                        } else {
                            setFormData({
                                ...formData,
                                rating: ""
                            });
                        }
                    }} 
                    required 
                    placeholder="Enter rating (0.1 - 5.0)" />
                </Form.Group>

               <div className="d-flex justify-content-center mt-4">
                    <Button
                        type="submit"
                        className="btn btn-primary border border-primary-600 text-md px-5 py-3 radius-8"
                        disabled={!canSubmit}  // disable if cannot submit
                    >
                    Submit
                    </Button>
                </div>
            </Form>
        </div>
    </div>
    </>
  )
}

export default PartnersList