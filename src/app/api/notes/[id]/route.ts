import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getNotesCollection } from "@/lib/mongodb";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const collection = await getNotesCollection();
    const note = await collection.findOne({ _id: new ObjectId(id) });

    if (!note) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...note,
        _id: note._id?.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching note", error);
    return NextResponse.json(
      { message: "Failed to fetch note" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const { title, content } = body as { title?: string; content?: string };

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required" },
        { status: 400 },
      );
    }

    const collection = await getNotesCollection();
    const updated = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    if (!updated) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        ...updated,
        _id: updated._id?.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating note", error);
    return NextResponse.json(
      { message: "Failed to update note" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid id" }, { status: 400 });
    }

    const collection = await getNotesCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting note", error);
    return NextResponse.json(
      { message: "Failed to delete note" },
      { status: 500 },
    );
  }
}
