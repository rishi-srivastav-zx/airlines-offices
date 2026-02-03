      {/* Modal */}
      {isModalOpen && (
        <BlogFormModal
          mode={modalMode}
          blog={selectedBlog}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      </div>
    </>
  );
}