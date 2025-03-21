import React, { useState, useEffect } from "react";

import { Button } from "@bigbinary/neetoui";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

import postsApi from "apis/posts";
import createConsumer from "channels/consumer";
import { subscribeToReportDownloadChannel } from "channels/reportDownloadChannel";
import ProgressBar from "components/commons/ProgressBar";

const DownloadReport = ({ isOpen, onClose, slug }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing report generation...");
  const [isDownloading, setIsDownloading] = useState(false);

  const consumer = createConsumer();

  // Generate the PDF report for the post on the server
  const generatePdf = async () => {
    try {
      await postsApi.generatePdf(slug);
    } catch (error) {
      logger.error(error);
      setMessage("Error generating report. Please try again.");
    }
  };

  // Helper function to trigger browser download
  const saveAs = ({ blob, fileName }) => {
    const objectUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 150);
  };

  // Download the generated PDF report
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setMessage("Downloading report...");
      const response = await postsApi.download(slug);
      saveAs({ blob: response.data, fileName: `post_report_${slug}.pdf` });
      onClose(); // Close the alert after download starts
    } catch (error) {
      setMessage("Error downloading report. Please try again.");
      logger.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setMessage("Initializing report generation...");

      const subscription = subscribeToReportDownloadChannel({
        consumer,
        setMessage,
        setProgress,
        generatePdf,
      });

      return () => {
        subscription.unsubscribe();
        consumer.disconnect();
      };
    }

    return undefined;
  }, [isOpen, slug]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">
            Generate PDF Report
          </h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            type="button"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
        <div className="mb-6">
          <p className="mb-4 text-base text-gray-600">{message}</p>
          <div className="w-full">
            <ProgressBar progress={progress} />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <Button label="Cancel" style="text" onClick={onClose} />
          <Button
            disabled={progress < 100}
            label="Download"
            loading={isDownloading}
            style="primary"
            onClick={handleDownload}
          />
        </div>
      </motion.div>
    </div>
  );
};

DownloadReport.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
};

export default DownloadReport;
