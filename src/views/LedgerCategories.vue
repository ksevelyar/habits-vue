<template lang="pug">
.ledger-categories
  .ledger-categories__heading
    h1.ledger-categories__title Ledger categories
    router-link.ledger-categories__transactions(:to="{ name: 'Ledger' }") Back to ledger

  span.ledger-categories__error(v-if="errorMessage") {{ errorMessage }}
  span.ledger-categories__loading(v-if="loading") Loading categories…

  form.ledger-categories__form(@submit.prevent="saveCategory")
    input.ledger-categories__input(
      v-model.trim="categoryName"
      placeholder="Category name"
      required
    )
    button.ledger-categories__submit(type="submit" :disabled="submitting") {{ getSubmitLabel() }}

  span.ledger-categories__empty(v-if="!loading && !errorMessage && categories.length === 0") No categories yet.

  .ledger-categories__list(v-else)
    .ledger-categories__item(v-for="category in categories" :key="category.id")
      span.ledger-categories__name {{ category.name }}
      .ledger-categories__actions
        button.ledger-categories__edit(type="button" @click="editCategory(category)") Edit
        button.ledger-categories__delete(type="button" @click="deleteCategory(category)") Delete
</template>

<script setup>
import { ref } from 'vue'
import ledger from '@/ledger'

const categories = ref([])
const categoryName = ref('')
const editingCategoryId = ref(null)
const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')

loadCategories()

async function loadCategories() {
  loading.value = true
  errorMessage.value = ''

  try {
    categories.value = await ledger.listCategories()
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to load categories.')
  } finally {
    loading.value = false
  }
}

function getSubmitLabel() {
  if (editingCategoryId.value !== null) return 'Update'

  return 'Create'
}

function editCategory(category) {
  editingCategoryId.value = category.id
  categoryName.value = category.name
  errorMessage.value = ''
}

function resetCategoryForm() {
  editingCategoryId.value = null
  categoryName.value = ''
}

async function saveCategory() {
  submitting.value = true
  errorMessage.value = ''

  try {
    if (editingCategoryId.value === null) {
      await ledger.createCategory(categoryName.value)
    } else {
      await ledger.updateCategory(editingCategoryId.value, categoryName.value)
    }

    resetCategoryForm()
    await loadCategories()
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to save category.')
  } finally {
    submitting.value = false
  }
}

async function deleteCategory(category) {
  errorMessage.value = ''

  try {
    await ledger.deleteCategory(category.id)
    if (editingCategoryId.value === category.id) resetCategoryForm()

    categories.value = categories.value.filter((candidate) => candidate.id !== category.id)
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Unable to delete category.')
  }
}

function getErrorMessage(error, fallbackMessage) {
  return error?.error || error?.message || fallbackMessage
}
</script>

<style>
.ledger-categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px 24px;
}

.ledger-categories__heading,
.ledger-categories__item,
.ledger-categories__form,
.ledger-categories__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ledger-categories__heading,
.ledger-categories__item {
  justify-content: space-between;
}

.ledger-categories__title {
  margin: 0;
}

.ledger-categories__form {
  width: 100%;
}

.ledger-categories__input {
  flex: 1;
  min-width: 0;
  padding: 6px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
}

.ledger-categories__submit {
  margin-left: auto;
}

.ledger-categories__list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ledger-categories__item {
  min-height: 42px;
  padding: 8px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
  background: var(--color-7);
}

.ledger-categories__submit,
.ledger-categories__edit,
.ledger-categories__delete {
  padding: 6px 10px;
  border: 1px solid var(--color-3);
  border-radius: 4px;
  background: var(--color-6);
  cursor: pointer;
}

.ledger-categories__error {
  color: var(--color-red);
}
</style>
