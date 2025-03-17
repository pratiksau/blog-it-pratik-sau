import React from "react";

import { Input, Textarea } from "@bigbinary/neetoui";
import { Form } from "@bigbinary/neetoui/formik";
import classnames from "classnames";
import Select from "react-select";

import { validationSchema } from "../../utils/validation";

const BlogForm = ({
  handleSubmit,
  categories,
  post,
  isEdit = false,
  onFormChange,
  formRef,
}) => {
  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const selectedCategories =
    isEdit && post.categories
      ? post.categories.map(category => ({
          value: category.id,
          label: category.name,
        }))
      : [];

  const initialValues = {
    title: isEdit ? post.title : "",
    description: isEdit ? post.description : "",
    selectedCategories: isEdit ? selectedCategories : [],
  };

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
        innerRef: formRef,
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
      }) => {
        // Handle form changes for preview functionality
        const handleFormFieldChange = (field, value) => {
          if (onFormChange) {
            const updatedValues = { ...values, [field]: value };
            onFormChange(updatedValues);
          }
        };

        return (
          <div className="w-full">
            <div className="mb-6">
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="blog-title"
              >
                Title
              </label>
              <Input
                data-cyy="blog-title-input"
                id="blog-title"
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
                onChange={e => {
                  handleChange(e);
                  handleFormFieldChange("title", e.target.value);
                }}
              />
              {touched.title && errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="categories"
              >
                Categories
              </label>
              <Select
                isMulti
                id="categories"
                name="selectedCategories"
                options={categoryOptions}
                placeholder="Select categories"
                value={values.selectedCategories}
                className={classnames({
                  "border-red-500":
                    touched.selectedCategories && errors.selectedCategories,
                })}
                onBlur={() => setFieldTouched("selectedCategories", true)}
                onChange={selected => {
                  setFieldValue("selectedCategories", selected || []);
                  handleFormFieldChange("selectedCategories", selected || []);
                }}
              />
              {touched.selectedCategories && errors.selectedCategories && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.selectedCategories}
                </p>
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
              <Textarea
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
                  "border-gray-300": !(
                    touched.description && errors.description
                  ),
                })}
                onBlur={handleBlur}
                onChange={e => {
                  handleChange(e);
                  handleFormFieldChange("description", e.target.value);
                }}
              />
              {touched.description && errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        );
      }}
    </Form>
  );
};

export default BlogForm;
