
import React, { useState, useEffect } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import { Button } from "../ui/components/Button";
import { DropdownMenu } from "../ui/components/DropdownMenu";
import * as SubframeCore from "@subframe/core";

interface Url {
  id: string;
  url: string;
  domain_name: string;
  author: string;
  date_published: string;
}

const BookshelfPage: React.FC = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [urlsLoading, setUrlsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate loading data from Supabase
    setTimeout(() => {
      const mockUrls: Url[] = [
        {
          id: "1",
          url: "https://example.com/article1",
          domain_name: "example.com",
          author: "John Doe",
          date_published: "2023-01-15"
        },
        {
          id: "2",
          url: "https://techblog.com/article2",
          domain_name: "techblog.com",
          author: "Jane Smith",
          date_published: "2023-02-20"
        },
        {
          id: "3",
          url: "https://news.com/story3",
          domain_name: "news.com",
          author: "Alex Johnson",
          date_published: "2023-03-10"
        }
      ];
      setUrls(mockUrls);
      setUrlsLoading(false);
    }, 1000);
  }, []);

  const getCurrentPageUrls = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return urls.slice(startIndex, endIndex);
  };

  return (
    <DefaultPageLayout>
      <div className="flex flex-col h-full p-8 w-full overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Explore Bookshelves</h1>

        {urlsLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex w-full flex-col items-start gap-6">
                <span className="w-full text-heading-2 font-heading-2 text-default-font">
                  Browse all essays
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <SubframeCore.DropdownMenu.Root>
                    <SubframeCore.DropdownMenu.Trigger asChild={true}>
                      <Button
                        variant="neutral-secondary"
                        icon="FeatherBlinds"
                        iconRight="FeatherChevronDown"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                      >
                        All domains
                      </Button>
                    </SubframeCore.DropdownMenu.Trigger>
                    <SubframeCore.DropdownMenu.Portal>
                      <SubframeCore.DropdownMenu.Content
                        side="bottom"
                        align="start"
                        sideOffset={4}
                        asChild={true}
                      >
                        <DropdownMenu>
                          <DropdownMenu.DropdownItem icon={null}>
                            Favorites
                          </DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem icon={null}>
                            Top Gainers
                          </DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem icon={null}>
                            Top Losers
                          </DropdownMenu.DropdownItem>
                          <DropdownMenu.DropdownItem icon={null}>
                            Recently Updated
                          </DropdownMenu.DropdownItem>
                        </DropdownMenu>
                      </SubframeCore.DropdownMenu.Content>
                    </SubframeCore.DropdownMenu.Portal>
                  </SubframeCore.DropdownMenu.Root>
                </div>
              </div>
              
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Published</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentPageUrls().map((url) => (
                    <tr key={url.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {url.url}
                        </a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{url.domain_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{url.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{url.date_published}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 mx-1">
                Page {currentPage} of {Math.ceil(urls.length / itemsPerPage)}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(urls.length / itemsPerPage)))}
                disabled={currentPage >= Math.ceil(urls.length / itemsPerPage)}
                className="px-4 py-2 mx-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultPageLayout>
  );
};

export default BookshelfPage;
