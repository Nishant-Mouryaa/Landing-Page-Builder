"use client";

import * as z from "zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import LinkFields from "@/components/form/link-fields";
import { updateProjectLayoutAction } from "@/app/_actions/project";
import { ImageElementStore } from "@/store/imageSlice";
import { updateSection } from "@/store/layoutSlice";
import { layoutReducer } from "@/types/types";
import { Loader2 } from "lucide-react";
import cloneDeep from "lodash/cloneDeep";
import ImageInput from "@/components/form/image-input";
import TextInput from "@/components/form/text-input";
import { footerFromSchema } from "@/lib/validations";
import ImageService from "@/lib/image-service";

export default function FooterForm() {
    const params = useParams();
    const footer = useSelector((state: layoutReducer) => state.layout.elements.footer);
    const data = useSelector((state: layoutReducer) => state.layout);
    const dispatch = useDispatch();

    type formSchemaValues = z.infer<typeof footerFromSchema>;

    const defaultValues: Partial<formSchemaValues> = {
        social: footer?.section?.social?.map((link) => ({
            label: link.label || "",
            link: link.link || "",
        })),
        services: footer?.section?.services?.map((link) => ({
            label: link.label || "",
            link: link.link || "",
        })),
        main: {
            title: footer?.section?.main?.title || "",
            description: footer?.section?.main?.description || "",
            copyRight: footer?.section?.main?.copyright || "",
            privacyAndPolicy: {
                label: footer?.section?.main?.privacyAndPolicy?.label || "",
                link: footer?.section?.main?.privacyAndPolicy?.link || "",
            },
        },
        contact: {
            mail: footer?.section?.contact?.mail || "",
            phone: footer?.section?.contact?.phone || "",
            address: footer?.section?.contact?.address || "",
        },
        ctaButton: {
            label: footer?.section?.main?.ctaButton?.label || "",
            link: footer?.section?.main?.ctaButton?.link || "",
        },
    };

    const form = useForm<z.infer<typeof footerFromSchema>>({
        resolver: zodResolver(footerFromSchema),
        defaultValues,
    });

    const footerLogo = useSelector((state: ImageElementStore) => {
        const imageElement = state.image.find(
            (element) => element.key === `footer-logo-${params.id}`
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
                section: "footer",
                path: ["logo", "src"],
                value: url,
            }));
            return url;
        } catch (error) {
            console.log("[IMAGE_UPLOAD_ERROR]", error);
        }
    };

    async function onSubmit(values: z.infer<typeof footerFromSchema>) {
        try {
            if (!footerLogo) {
                form.setError("logo", { message: "Image is required" });
            }

            let url;
            if (footerLogo) {
                url = await uploadImage(await getImageBlob(footerLogo));
            }

            const newData = cloneDeep(data);
            newData.elements.footer = newData.elements.footer || {};
            newData.elements.footer.logo = newData.elements.footer.logo || { src: "" };
            newData.elements.footer.logo.src = url;

            await updateProjectLayoutAction(params.id as string, newData);
        } catch (error) {
            console.log("[FOOTER_LAYOUT_SAVE_ERROR]", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ImageInput
                    form={form}
                    fieldname={`footer-logo-${params.id}`}
                    label="Logo"
                    description="This will be the logo for the footer."
                    src={footer?.logo?.src}
                />
                <TextInput
                    form={form}
                    fieldname="main.title"
                    onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "main", "title"], value }))}
                    label="Title"
                    placeholder=""
                    description="This will be the title text of the footer."
                />
                <div className="md:flex gap-4 w-full">
                    <TextInput
                        form={form}
                        fieldname="ctaButton.label"
                        onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "main", "ctaButton", "label"], value }))}
                        label="Button Label"
                        placeholder="CTA Button Label"
                        description="This will be the label of your cta button."
                    />
                    <TextInput
                        form={form}
                        fieldname="ctaButton.link"
                        onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "main", "ctaButton", "link"], value }))}
                        label="Button Link"
                        placeholder="CTA Button link"
                        description="This will be the link of your cta button."
                    />
                </div>
                <TextInput
                    form={form}
                    fieldname="main.description"
                    onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "main", "description"], value }))}
                    label="Description"
                    placeholder=""
                    description="This will be the description text of the footer."
                />
                <TextInput
                    form={form}
                    fieldname="main.copyRight"
                    onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "main", "copyright"], value }))}
                    label="Copy Right Label"
                    placeholder=""
                    description="This will be the label for copyright."
                />
                <div className="md:flex gap-4 w-full">
                    <TextInput
                        form={form}
                        fieldname="main.privacyAndPolicy.label"
                        onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "main", "privacyAndPolicy", "label"], value }))}
                        label="Privacy Policy Label"
                        placeholder="Privacy Policy Label"
                        description="Label for privacy policy."
                    />
                    <TextInput
                        form={form}
                        fieldname="main.privacyAndPolicy.link"
                        onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "main", "privacyAndPolicy", "link"], value }))}
                        label="Privacy Policy Link"
                        placeholder="Privacy Policy Link"
                        description="Link for privacy policy."
                    />
                </div>
                <div className="md:flex gap-4 w-full">
                    <TextInput
                        form={form}
                        fieldname="contact.mail"
                        onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "contact", "mail"], value }))}
                        label="Contact Email"
                        placeholder="Contact Email"
                        description="Footer contact email."
                    />
                    <TextInput
                        form={form}
                        fieldname="contact.phone"
                        onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "contact", "phone"], value }))}
                        label="Contact Phone"
                        placeholder="Contact Phone"
                        description="Footer contact phone."
                    />
                    <TextInput
                        form={form}
                        fieldname="contact.address"
                        onChange={(value) => dispatch(updateSection({ section: "footer", path: ["section", "contact", "address"], value }))}
                        label="Contact Address"
                        placeholder="Contact Address"
                        description="Footer contact address."
                    />
                </div>
                <LinkFields
                    form={form}
                    fieldName="social"
                    label="Social Links"
                    description="Add your social links."
                    links={footer?.section?.social || []}
                    onChange={(links) => dispatch(updateSection({ section: "footer", path: ["section", "social"], value: links }))}
                />
                <LinkFields
                    form={form}
                    fieldName="services"
                    label="Services Links"
                    description="Add your services links."
                    links={footer?.section?.services || []}
                    onChange={(links) => dispatch(updateSection({ section: "footer", path: ["section", "services"], value: links }))}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                    Save Footer
                </Button>
            </form>
        </Form>
    );
}
