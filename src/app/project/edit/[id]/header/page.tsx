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

export default function HeaderForm() {
    const params = useParams();
    const header = useSelector((state: layoutReducer) => state.layout.elements.header);
    const data = useSelector((state: layoutReducer) => state.layout);
    const dispatch = useDispatch();

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

    const isLoading = form.formState.isSubmitting;

    const getImageBlob = async (url: string) => {
        const blob = await fetch(url).then((r) => r.blob());
        return blob;
    };

    const uploadImage = async (image: Blob) => {
        try {
            const url = await ImageService.upload(image);
            dispatch(updateSection({
                section: "header",
                path: ["image"],
                value: url,
            }));
            return url;
        } catch (error) {
            console.log("[IMAGE_UPLOAD_ERROR]", error);
        }
    };

    async function onSubmit() {
        try {
            if (!heroImage) {
                form.setError("heroImage", { message: "Image is required" });
            }

            let url;
            if (heroImage) {
                url = await uploadImage(await getImageBlob(heroImage));
            }

            const newData = cloneDeep(data);
            newData.elements.header = newData.elements.header || {};
            newData.elements.header.image = url;

            await updateProjectLayoutAction(params.id as string, newData);
        } catch (error) {
            console.log("[HEADER_LAYOUT_SAVE_ERROR]", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ImageInput
                    form={form}
                    fieldname={`hero-image-${params.id}`}
                    label="Hero Image"
                    description="This will be the hero image for the header."
                    src={header?.image}
                    square
                />
                <TextInput
                    form={form}
                    fieldname="heading"
                    onChange={(value) => dispatch(updateSection({ section: "header", path: ["heading"], value }))}
                    label="Heading"
                    placeholder="Your Heading"
                    description="This will be the main text block of the header."
                />
                <TextInput
                    form={form}
                    fieldname="description"
                    onChange={(value) => dispatch(updateSection({ section: "header", path: ["description"], value }))}
                    label="Description"
                    placeholder="Your Description"
                    description="This will be the secondary text block of the header."
                />
                <div className="md:flex gap-4 w-full">
                    <TextInput
                        form={form}
                        fieldname="ctaButton.label"
                        onChange={(value) => dispatch(updateSection({ section: "header", path: ["ctaButton", "label"], value }))}
                        label="Button Label"
                        placeholder="CTA Button Label"
                        description="This will be the label of your cta button."
                    />
                    <TextInput
                        form={form}
                        fieldname="ctaButton.link"
                        onChange={(value) => dispatch(updateSection({ section: "header", path: ["ctaButton", "link"], value }))}
                        label="Button Link"
                        placeholder="CTA Button link"
                        description="This will be the link of your cta button."
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    {isLoading && (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            &nbsp;
                        </>
                    )}
                    Save
                </Button>
            </form>
        </Form>
    );
}
