import React, { useEffect, useState } from "react";
import { fetchIssues } from "../services/api";

const IssueList = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const getIssues = async () => {
      try {
        const { data } = await fetchIssues();
        setIssues(data);
      } catch (error) {
        console.error(error);
      }
    };

    getIssues();
  }, []);

  return (
    <div>
      <h2>Reported Issues</h2>

      {issues.map((issue) => (
        <div key={issue._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{issue.title}</h3>
          <p>{issue.description}</p>
          <p><strong>Category:</strong> {issue.category}</p>
          <p><strong>Location:</strong> {issue.location}</p>
          <p><strong>Status:</strong> {issue.status}</p>
        </div>
      ))}
    </div>
  );
};

export default IssueList;
