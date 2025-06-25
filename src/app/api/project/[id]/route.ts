import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        // For now, we'll skip authentication check in API routes
        // In a production app, you'd want to verify Firebase tokens server-side
        // This would require additional setup with Firebase Admin SDK
        
        if (!params.id) {
            throw Error("ID is required");
        }

        const project = await db.select().from(projects).where(eq(projects.id, params.id));

        if(project.length === 0) {
            return new NextResponse("Project not found.", { status: 404 });
        }

        return NextResponse.json(project[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
