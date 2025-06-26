"use client";

import * as z from "zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateProjectLayoutAction } from "@/app/_actions/project";
import { ImageElementStore } from "@/store/imageSlice";
import { updateSection } from "@/store/layoutSlice";
import { layoutReducer } from "@/types/types";
import { Loader2 } from "lucide-react";
import cloneDeep from "lodash/cloneDeep";
import ImageInput from "@/components/form/image-input";
import TextInput from "@/components/form/text-input";
import { headerFromSchema } from "@/lib/validations";
import ImageService from "@/lib/image-service";
import ImageUploadService from "@/lib/image-service";
import {useFormSubmit} from "@/hooks/useFormSubmit";

export default function HeaderForm() {
    const params = useParams();
    const header = useSelector((state: layoutReducer) => state.layout.elements.header);
    const data = useSelector((state: layoutReducer) => state.layout);
    const dispatch = useDispatch();
    const { isLoading, handleSubmit } = useFormSubmit();

    const defaultValues: z.infer<typeof headerFromSchema> = {
        heading: header?.heading || "",
        description: header?.description || "",
        ctaButton: {
            label: header?.ctaButton?.label || "",
            link: header?.ctaButton?.link || "",
        },
    };

    const form = useForm<z.infer<typeof headerFromSchema>>({
        resolver: zodResolver(headerFromSchema),
        defaultValues,
    });

    const heroImage = useSelector((state: ImageElementStore) => {
        const imageElement = state.image.find(
            (element) => element.key === `hero-image-${params.id}`
        );
        return imageElement ? imageElement.url : null;
    });

    const onSubmit = async (values: z.infer<typeof headerFromSchema>) => {
        await handleSubmit(async () => {
            // Validate image
            if (!heroImage) {
                form.setError("heroImage", { message: "Hero image is required" });
                throw new Error("Hero image is required");
            }

            // Upload image
            const imageUrl = await ImageUploadService.uploadImage(heroImage);

            // Update data
            const newData = cloneDeep(data);
            newData.elements.header = {
                ...newData.elements.header,
                ...values,
                image: imageUrl,
            };

            // Save to backend
            await updateProjectLayoutAction(params.id as string, newData);
        }, "Header updated successfully!");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Header Content</h3>
                    
                    <ImageInput
                        form={form}
                        fieldname={`hero-image-${params.id}`}
                        label="Hero Image"
                        description="Upload a compelling hero image for your header section."
                        src={header?.image}
                        square
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <TextInput
                            form={form}
                            fieldname="heading"
                            onChange={(value) => dispatch(updateSection({ 
                                section: "header", 
                                path: ["heading"], 
                                value 
                            }))}
                            label="Heading"
                            placeholder="Enter your main heading"
                            description="The main headline that visitors will see first."
                        />

                        <TextInput
                            form={form}
                            fieldname="description"
                            onChange={(value) => dispatch(updateSection({ 
                                section: "header", 
                                path: ["description"], 
                                value 
                            }))}
                            label="Description"
                            placeholder="Enter a compelling description"
                            description="Supporting text that explains your value proposition."
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Call to Action</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextInput
                            form={form}
                            fieldname="ctaButton.label"
                            onChange={(value) => dispatch(updateSection({ 
                                section: "header", 
                                path: ["ctaButton", "label"], 
                                value 
                            }))}
                            label="Button Text"
                            placeholder="Get Started"
                            description="The text displayed on your CTA button."
                        />

                        <TextInput
                            form={form}
                            fieldname="ctaButton.link"
                            onChange={(value) => dispatch(updateSection({ 
                                section: "header", 
                                path: ["ctaButton", "link"], 
                                value 
                            }))}
                            label="Button Link"
                            placeholder="https://example.com"
                            description="Where the button should redirect users."
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Header
                    </Button>
                </div>
            </form>
        </Form>
    );
}