
import React from "react";
import { useParams } from "react-router-dom";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { IconButton } from "../ui/components/IconButton";
import { DropdownMenu } from "../ui/components/DropdownMenu";
import { Button } from "../ui/components/Button";
import { Avatar } from "../ui/components/Avatar";
import { Table } from "../ui/components/Table";

function LibraryPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full items-start gap-12 bg-default-background py-12 mobile:flex-col mobile:flex-nowrap mobile:gap-12 mobile:px-6 mobile:py-6">
        <div className="flex grow shrink-0 basis-0 flex-col items-start gap-8 self-stretch rounded-md bg-neutral-50 px-12 py-12 overflow-auto mobile:h-auto mobile:w-full mobile:flex-none mobile:rounded-none mobile:border-none mobile:bg-transparent mobile:px-0 mobile:py-0 mobile:shadow-none">
          <div className="flex w-full items-end gap-6 mobile:flex-col mobile:flex-nowrap mobile:items-center mobile:justify-start mobile:gap-6">
            <div className="flex h-40 w-40 flex-none flex-col items-center justify-center gap-2 overflow-hidden rounded-md shadow-lg">
              <img
                className="w-full grow shrink-0 basis-0 object-cover"
                src="https://res.cloudinary.com/subframe/image/upload/v1723780559/uploads/302/tkyvdicnwbc5ftuyysc0.png"
              />
            </div>
            <div className="flex grow shrink-0 basis-0 flex-col items-start gap-6 mobile:items-center mobile:justify-start">
              <div className="flex w-full flex-col items-start gap-2 mobile:items-center mobile:justify-start">
                <span className="text-caption-bold font-caption-bold text-default-font">
                  RADAR
                </span>
                <span className="w-full text-heading-1 font-heading-1 text-default-font mobile:text-center">
                  Climate & Care - Bookshelf {id}
                </span>
                <span className="text-body font-body text-default-font mobile:text-center">
                  How can we re-write ecologies of care through the lens of indigenous heritage and the earth's natural primitives?
                </span>
              </div>
            </div>
          </div>
          
          <div className="w-full mt-8">
            <h2 className="text-heading-3 font-heading-3 text-default-font mb-4">Essays in this collection</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-neutral-border rounded-md">
                <h3 className="text-body-bold">What is Climate Care?</h3>
                <p className="text-body">An exploration of new frameworks for environmental stewardship</p>
              </div>
              <div className="p-4 border border-neutral-border rounded-md">
                <h3 className="text-body-bold">Indigenous Knowledge Systems</h3>
                <p className="text-body">Lessons from traditional ecological knowledge</p>
              </div>
              <div className="p-4 border border-neutral-border rounded-md">
                <h3 className="text-body-bold">Regenerative Practices</h3>
                <p className="text-body">Moving beyond sustainability to regeneration</p>
              </div>
              <div className="p-4 border border-neutral-border rounded-md">
                <h3 className="text-body-bold">Community-Led Conservation</h3>
                <p className="text-body">Case studies of successful local initiatives</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default LibraryPage;
