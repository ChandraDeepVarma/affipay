// src/pages/api/users/partnerslist

import dbConnect from '@/lib/mongoose';
import Partners from '@/models/Partners';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // disable Next.js default body parser
  },
};

export default async function handle(req,res){
    await dbConnect();

        if (req.method === 'POST') {
            const form = formidable({
            uploadDir: path.join(process.cwd(), '/public/uploads'),
            keepExtensions: true,
            });

            form.parse(req, async (err, fields, files) => {
            if (err) return res.status(500).json({ message: 'File upload error' });

            try {
            // handle formidable array values
            const partnername = Array.isArray(fields.partnername) ? fields.partnername[0] : fields.partnername;
            let rating = Array.isArray(fields.rating) ? fields.rating[0] : fields.rating;

            // ensure rating is a number
            rating = parseFloat(rating);

            const image = files.image ? `/uploads/${files.image[0].newFilename}` : null;

            const existing = await Partners.findOne({ partnername });
            if (existing) return res.status(400).json({ message: "This Partner already exists" });

            const partner = await Partners.create({ partnername, rating, image });
            return res.status(201).json(partner);
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
            });
            return ;
        }
        if(req.method === 'GET'){
            try {
                const partners = await Partners.find().sort({createdAt : -1 });
                return res.status(200).json(partners)
            } catch (error) {
                return res.status(500).json({message: error.message})
            }
        }

        res.setHeader('Allow',['GET','POST']);
        res.status(405).end(`Method Not ${req.method} Allowed`)
}