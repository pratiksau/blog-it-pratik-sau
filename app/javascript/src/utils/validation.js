import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  title: Yup.string()
    .max(100, "Title must be less than 100 characters")
    .required("Title is required"),
  description: Yup.string()
    .max(10000, "Description must be less than 10000 characters")
    .required("Description is required"),
  selectedCategories: Yup.array()
    .min(1, "Please select at least one category")
    .required("Category is required"),
});
