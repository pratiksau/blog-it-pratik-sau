import React from "react";

import { Button } from "@bigbinary/neetoui";
import { Form } from "@bigbinary/neetoui/formik";
import classnames from "classnames";

import { validationSchema } from "../../utils/validation";

const BlogForm = ({ loading, handleSubmit, handleCancel }) => {
  const initialValues = { title: "", description: "" };

  const onSubmit = (values, { setSubmitting }) => {
    handleSubmit(values);
    setSubmitting(false);
  };

  return (
    <Form
      formikProps={{
        initialValues,
        validationSchema,
        onSubmit,
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <div className="w-full">
          <div className="mb-6">
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="blog-title"
            >
              Title
            </label>
            <input
              data-cyy="blog-title-input"
              id="blog-title"
              // label="Title"
              maxLength={100}
              name="title"
              placeholder="Enter title"
              type="text"
              value={values.title}
              className={classnames("w-full border p-2", {
                "border-red-500": touched.title && errors.title,
                "border-gray-300": !(touched.title && errors.title),
              })}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.title && errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          <div className="mb-6">
            <div className="flex justify-between">
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="blog-description"
              >
                Description
              </label>
              <span className="text-xs text-gray-500">
                {values.description.length}/10000
              </span>
            </div>
            <textarea
              cols={70}
              dataCy="blog-description-textarea"
              id="blog-description"
              maxLength={10000}
              name="description"
              placeholder="Enter description"
              rows={10}
              style={{ resize: "vertical" }}
              value={values.description}
              className={classnames("w-full border p-2", {
                "border-red-500": touched.description && errors.description,
                "border-gray-300": !(touched.description && errors.description),
              })}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.description && errors.description && (
              <p className="mt-1 text-sm text-red-500">{errors.description}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              className="border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
              data-cy="cancel-button"
              disabled={loading || isSubmitting}
              style="tertiary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
              data-cy="submit-button"
              disabled={loading || isSubmitting}
              style="primary"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};

export default BlogForm;
