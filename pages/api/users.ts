import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma } from '@prisma/client';
import prisma from '../db';
import firebase from 'firebase/app';

// POST /api/user
// Required fields in body: firebaseUID, email
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Checks if user already exists.
    const data = JSON.parse(req.body);
    const userWhere: Prisma.UsersWhereUniqueInput = {
      firebaseUID: data.firebaseUID,
    };
    const existingUser = await prisma.users.findUnique({
      where: userWhere,
    });

    if (existingUser) {
      res.status(200).json(existingUser);
      return;
    }

    const user: Prisma.UsersCreateInput = {
      email: data.email,
      firebaseUID: data.firebaseUID,
    };
    const savedUser = await prisma.users.create({ data: user });
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Something went wrong' });
  }
};
