import React, { useState, useEffect } from 'react';
import { DefaultPageLayout } from '@/ui/layouts/DefaultPageLayout';
import { urlService, Url } from '@/services/urlService';
import { Table } from '@/ui/components/Table';

function BookshelfPage() {
  // URL state
  const [urls, setUrls] = useState<Url[]>([]);
  const [urlsLoading, setUrlsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  // Fetch URLs from Supabase
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setUrlsLoading(true);
        const data = await urlService.getUrls();
        setUrls(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching URLs:', error);
      } finally {
        setUrlsLoading(false);
      }
    };

    fetchUrls();
  }, []);

  // Calculate pagination
  const getCurrentPageUrls = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return urls.slice(startIndex, endIndex);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <DefaultPageLayout>
      <div className="flex flex-col h-full p-8 w-full overflow-auto">
        <h1 className="text-2xl font-bold mb-6">My URLs</h1>

        {urlsLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Loading URLs...</p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>URL</Table.Header>
                    <Table.Header>Domain</Table.Header>
                    <Table.Header>Author</Table.Header>
                    <Table.Header>Date Published</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {getCurrentPageUrls().map((url) => (
                    <Table.Row key={url.id}>
                      <Table.Cell>
                        <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {url.url}
                        </a>
                      </Table.Cell>
                      <Table.Cell>{url.domain_name}</Table.Cell>
                      <Table.Cell>{url.author}</Table.Cell>
                      <Table.Cell>{url.date_published}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultPageLayout>
  );
}

export default BookshelfPage;