import React, { useState } from "react";

import { Modal, Button, Typography, Input } from "@bigbinary/neetoui";

const CategoryModal = ({ isOpen, onClose, onSubmit }) => {
  const [categoryName, setCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ name: categoryName });
      setCategoryName("");
      onClose();
    } catch (error) {
      logger("Error creating category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header>
        <Typography id="dialog1Title" style="h2">
          New Category
        </Typography>
      </Modal.Header>
      <Modal.Body className="space-y-2">
        <Input
          label="Category title"
          value={categoryName}
          onChange={e => setCategoryName(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer className="space-x-2">
        <Button
          className="rounded-none bg-black text-white"
          label="Create"
          loading={isSubmitting}
          onClick={handleSubmit}
        />
        <Button
          className="rounded-none border-black bg-white text-black"
          label="Cancel"
          style="tertiary"
          onClick={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
