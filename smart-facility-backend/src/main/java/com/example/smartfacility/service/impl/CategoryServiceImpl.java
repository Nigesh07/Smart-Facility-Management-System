package com.example.smartfacility.service.impl;

import com.example.smartfacility.dto.request.CreateCategoryRequest;
import com.example.smartfacility.dto.response.CategoryResponse;
import com.example.smartfacility.exception.BadRequestException;
import com.example.smartfacility.exception.ResourceNotFoundException;
import com.example.smartfacility.model.Category;
import com.example.smartfacility.repository.CategoryRepository;
import com.example.smartfacility.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("A category with this name already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .active(true)
                .build();

        return toResponse(categoryRepository.save(category));
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByActiveTrue().stream().map(this::toResponse).toList();
    }

    @Override
    public CategoryResponse updateCategory(Long id, CreateCategoryRequest request) {
        Category category = getCategoryOrThrow(id);
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategoryStatus(Long id, boolean active) {
        Category category = getCategoryOrThrow(id);
        category.setActive(active);
        return toResponse(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) {
        Category category = getCategoryOrThrow(id);
        categoryRepository.delete(category);
    }

    private Category getCategoryOrThrow(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .active(category.isActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
