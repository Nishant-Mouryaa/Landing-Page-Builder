"use server";

import { v4 as uuidv4 } from "uuid";

import { newProjectFormSchema } from "@/components/new-project-form";
import * as z from "zod";
import { projects, users } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, desc, eq } from "drizzle-orm";
import { pageData } from "@/types/types";
import { user } from "../../../drizzle/schema";
import { revalidatePath } from "next/cache";

type NewProject = typeof projects.$inferInsert;

// TODO: Implement proper server-side Firebase authentication
// For now, we'll use a temporary user ID for development
const TEMP_USER_ID = "temp-user-id";

// Helper function to ensure test user exists
async function ensureTestUser() {
    try {
        const existingUser = await db.select().from(users).where(eq(users.id, TEMP_USER_ID));
        if (existingUser.length === 0) {
            await db.insert(users).values({
                id: TEMP_USER_ID,
                name: "Test User",
                email: "test@example.com",
            });
        }
    } catch (error) {
        console.error("Error ensuring test user:", error);
    }
}

export async function addProjectsAction(value: z.infer<typeof newProjectFormSchema>) {
    // Ensure test user exists
    await ensureTestUser();
    
    // TODO: Get actual user ID from Firebase token
    const result_projects: NewProject = {
        id: uuidv4(),
        userId: TEMP_USER_ID,
        title: value.title,
        description: value.description,
        content: { styles: {}, elements: {} },
    };

    const newProjectId = await db
        .insert(projects)
        .values(result_projects)
        .returning({ insertedId: projects.id });
    revalidatePath("/dashboard");

    return newProjectId[0].insertedId;
}

export async function getProjectAction(id: string) {
    // TODO: Verify user has access to this project
    const project = await db.select().from(projects).where(eq(projects.id, id));
    return project[0];
}

export async function updateProjectLayoutAction(id: string, layout: pageData) {
    // TODO: Verify user has access to this project
    await db
        .update(projects)
        .set({ content: layout, updatedAt: new Date() })
        .where(eq(projects.id, id));
}

export async function updateProjectPublishAction(id: string, isPublished: boolean) {
    // TODO: Verify user has access to this project
    const project = await db
        .update(projects)
        .set({ isPublished: isPublished, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
    return project[0];
}

export async function getProjectByUserAction() {
    // Ensure test user exists
    await ensureTestUser();
    
    // TODO: Get actual user ID from Firebase token
    const projectList = await db
        .select()
        .from(projects)
        .where(and(eq(projects.userId, TEMP_USER_ID), eq(projects.isActive, true)))
        .orderBy(desc(projects.updatedAt));
    return projectList;
}

export async function getPublishedProjectAction() {
    const projectList = await db
        .select()
        .from(projects)
        .innerJoin(users, eq(users.id, projects.userId))
        .where(and(eq(projects.isPublished, true), eq(projects.isActive, true)))
        .orderBy(desc(projects.updatedAt));
    return projectList;
}

export async function getSingleProjectAction(id: string) {
    const projectList = await db
        .select()
        .from(projects)
        .where(
            and(eq(projects.id, id), eq(projects.isPublished, true), eq(projects.isActive, true))
        );

    return projectList[0];
}
