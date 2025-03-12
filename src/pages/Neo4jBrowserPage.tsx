
import React, { useState, useEffect } from "react";
import { DefaultPageLayout } from "../ui/layouts/DefaultPageLayout";
import driver from '../lib/neo4j';
import { Button } from "../ui/components/Button";
import { TextField } from "../ui/components/TextField";

function Neo4jBrowserPage() {
  const [query, setQuery] = useState<string>("MATCH (n) RETURN n LIMIT 25");
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("Unknown");

  useEffect(() => {
    // Check connection status on mount
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      const session = driver.session();
      await session.run("RETURN 1 as result");
      setConnectionStatus("Connected");
      session.close();
    } catch (err) {
      console.error("Connection error:", err);
      setConnectionStatus("Error connecting to Neo4j");
      setError(`Failed to connect to Neo4j: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runQuery = async () => {
    setIsLoading(true);
    setError("");
    setResults([]);
    
    try {
      const session = driver.session();
      const result = await session.run(query);
      
      // Process results
      const processedResults = result.records.map(record => {
        const obj: any = {};
        record.keys.forEach(key => {
          const value = record.get(key);
          if (value && typeof value === 'object' && value.properties) {
            // For nodes and relationships with properties
            obj[key] = {
              type: value.labels ? `Node (${value.labels.join(', ')})` : 
                    value.type ? `Relationship (${value.type})` : 'Object',
              properties: value.properties
            };
          } else {
            obj[key] = value;
          }
        });
        return obj;
      });
      
      setResults(processedResults);
      session.close();
    } catch (err) {
      console.error("Query error:", err);
      setError(`Query failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultPageLayout>
      <div className="container max-w-none flex h-full w-full flex-col items-start gap-12 bg-default-background p-6">
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full justify-between items-center">
            <span className="text-heading-2 font-heading-2 text-default-font">
              Neo4j Browser
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${connectionStatus === 'Connected' ? 'text-success-700' : 'text-error-700'}`}>
                {connectionStatus}
              </span>
              <Button 
                variant="neutral-secondary" 
                onClick={checkConnection}
                disabled={isLoading}
              >
                Check Connection
              </Button>
            </div>
          </div>
          
          <div className="w-full flex flex-col gap-4 bg-white p-4 rounded-md border border-neutral-border">
            <TextField
              className="w-full h-auto"
              label="Cypher Query"
              helpText="Enter a Cypher query to execute"
            >
              <TextField.TextArea
                className="w-full font-mono"
                rows={5}
                value={query}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value)}
              />
            </TextField>
            
            <div className="flex justify-end">
              <Button
                variant="brand-primary"
                onClick={runQuery}
                disabled={isLoading}
              >
                {isLoading ? "Running..." : "Run Query"}
              </Button>
            </div>
            
            {error && (
              <div className="p-4 bg-error-100 border border-error-300 rounded-md text-error-700">
                {error}
              </div>
            )}
            
            {results.length > 0 && (
              <div className="overflow-auto w-full">
                <h3 className="text-heading-3 font-heading-3 text-default-font mb-2">
                  Results ({results.length})
                </h3>
                {results.map((result, index) => (
                  <div key={index} className="mb-4 p-4 bg-neutral-50 rounded-md border border-neutral-border">
                    <h4 className="text-body-bold font-body-bold text-default-font mb-2">
                      Record {index + 1}
                    </h4>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-96 bg-neutral-100 p-2 rounded text-sm">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultPageLayout>
  );
}

export default Neo4jBrowserPage;
