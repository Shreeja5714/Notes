import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getNotesCollection } from "@/lib/mongodb";

export async function GET() {
  try {
    const collection = await getNotesCollection();
    const notes = await collection
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      notes.map((note) => ({
        ...note,
        _id: (note._id as ObjectId).toString(),
      })),
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching notes", error);
    return NextResponse.json(
      { message: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content } = body as { title?: string; content?: string };

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 },
      );
    }

    const now = new Date();
    const newNote = {
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };

    const collection = await getNotesCollection();
    const result = await collection.insertOne(newNote);

    return NextResponse.json(
      {
        ...newNote,
        _id: result.insertedId.toString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating note", error);
    return NextResponse.json(
      { message: "Failed to create note" },
      { status: 500 },
    );
  }
}
