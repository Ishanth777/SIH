"use client";

import { useState, useEffect } from "react";
import { Search, Filter, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Dispute {
  id: string;
  jobId: string;
  raisedById: string;
  raisedByType: string; // CUSTOMER or WORKER
  category: string;
  description: string;
  status: string; // OPEN, IN_REVIEW, RESOLVED, ESCALATED
  createdAt: string;
}

export default function SocietyDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      // Assuming cooperativeId is fetched from context/auth
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const response = await fetch(`${apiUrl}/disputes`);
      if (response.ok) {
        const data = await response.json();
        // Handle paginated response if backend returns it
        setDisputes(data.data || data);
      }
    } catch (error) {
      console.error("Failed to fetch disputes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: string, status: string) => {
    setResolving(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const response = await fetch(`${apiUrl}/disputes/${id}/resolve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // Add auth header here
        },
        body: JSON.stringify({
          resolutionStatus: status,
          resolutionNotes: resolutionNotes,
        }),
      });

      if (response.ok) {
        alert("Dispute updated successfully");
        setSelectedDispute(null);
        setResolutionNotes("");
        fetchDisputes(); // Refresh list
      } else {
        alert("Failed to update dispute");
      }
    } catch (error) {
      console.error("Resolution error:", error);
    } finally {
      setResolving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "IN_REVIEW":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "RESOLVED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dispute Resolution</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search disputes..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Disputes List */}
        <div className="md:col-span-2 bg-white rounded-lg shadow border">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading disputes...
            </div>
          ) : disputes.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No disputes found.
            </div>
          ) : (
            <ul className="divide-y">
              {disputes.map((dispute) => (
                <li
                  key={dispute.id}
                  onClick={() => setSelectedDispute(dispute)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedDispute?.id === dispute.id ? "bg-blue-50" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dispute.status)}
                      <span className="font-semibold">{dispute.category}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {dispute.description}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      Job: {dispute.jobId.slice(0, 8)}...
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                      Raised by: {dispute.raisedByType}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dispute Details / Resolution Panel */}
        <div className="bg-white rounded-lg shadow border p-6 h-fit">
          {selectedDispute ? (
            <div>
              <h2 className="text-xl font-bold mb-4">Resolve Dispute</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="font-medium">{selectedDispute.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Description</label>
                  <p className="bg-gray-50 p-3 rounded-lg text-sm mt-1">
                    {selectedDispute.description}
                  </p>
                </div>

                <div className="pt-4 border-t mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Notes
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter notes about how this was resolved..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() =>
                      handleResolve(selectedDispute.id, "RESOLVED")
                    }
                    disabled={resolving || !resolutionNotes}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Mark Resolved
                  </button>
                  <button
                    onClick={() =>
                      handleResolve(selectedDispute.id, "ESCALATED")
                    }
                    disabled={resolving}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Escalate
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>
                Select a dispute from the list to view details and resolve it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
