package com.example.smartfacility.service;

import com.example.smartfacility.dto.request.CreateCategoryRequest;
import com.example.smartfacility.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CreateCategoryRequest request);

    List<CategoryResponse> getAllCategories();

    List<CategoryResponse> getActiveCategories();

    CategoryResponse updateCategory(Long id, CreateCategoryRequest request);

    CategoryResponse updateCategoryStatus(Long id, boolean active);

    void deleteCategory(Long id);
}
