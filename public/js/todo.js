document.addEventListener("DOMContentLoaded", () => {
    // Handle add todo form submission
    const addTodoForm = document.getElementById("addTodoForm");
    if (addTodoForm) {
        addTodoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const formData = new FormData(addTodoForm);
            const data = {
                machineName: formData.get("machineName"),
                position: formData.get("position"),
                checkpoint: formData.get("checkpoint"),
                comment: formData.get("comment")
            };

            try {
                const response = await fetch("/todo", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                if (result.success) {
                    alert("Tạo công việc thành công!");
                    location.reload();
                } else {
                    alert("Lỗi: " + result.message);
                }
            } catch (err) {
                console.error("Error creating todo:", err);
                alert("Không thể tạo công việc!");
            }
        });
    }

    // Handle generate todo form submission
    const generateTodoForm = document.getElementById("generateTodoForm");
    
    if (generateTodoForm) {
        // Initialize filter sections visibility on load
        if (typeof toggleFilterOptions === 'function') {
            toggleFilterOptions();
        }

        generateTodoForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const formData = new FormData(generateTodoForm);
            const filterType = document.getElementById('filterType').value;
            
            let data = {
                machineName: formData.get("machineName")
            };
            
            if (filterType === 'days') {
                data.days = parseInt(formData.get("days"));
            } else {
                data.startDate = formData.get("startDate");
                data.endDate = formData.get("endDate");
            }

            try {
                const response = await fetch("/todo/generate-from-checklist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert(`Đã tạo ${result.count} công việc từ checklist!\n(Từ ${result.checklistsProcessed} checklist)`);
                    
                    // Close modal and reload
                    const modal = bootstrap.Modal.getInstance(document.getElementById('generateTodoModal'));
                    if (modal) modal.hide();
                    location.reload();
                } else {
                    alert("Lỗi: " + result.message);
                }
            } catch (err) {
                console.error("Error generating todos:", err);
                alert("Không thể tạo công việc từ checklist!");
            }
        });
    }
});

// Update todo status
async function updateStatus(todoId, newStatus) {
    try {
        const response = await fetch(`/todo/${todoId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();
        if (result.success) {
            location.reload();
        } else {
            alert("Lỗi cập nhật trạng thái: " + result.message);
        }
    } catch (err) {
        console.error("Error updating status:", err);
        alert("Không thể cập nhật trạng thái!");
    }
}

// Delete todo
async function deleteTodo(todoId) {
    if (!confirm("Bạn có chắc muốn xóa công việc này không?")) {
        return;
    }

    try {
        const response = await fetch(`/todo/${todoId}`, {
            method: "DELETE"
        });

        const result = await response.json();
        if (result.success) {
            alert("Đã xóa công việc!");
            location.reload();
        } else {
            alert("Lỗi xóa công việc: " + result.message);
        }
    } catch (err) {
        console.error("Error deleting todo:", err);
        alert("Không thể xóa công việc!");
    }
}

// Filter todos
function filterTodos() {
    const statusFilter = document.getElementById("statusFilter").value;
    const machineFilter = document.getElementById("machineFilter").value;

    const table = document.getElementById("todosTable");
    const rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (let row of rows) {
        const status = row.getAttribute("data-status");
        const machine = row.getAttribute("data-machine");
     
        let show = true;

        if (statusFilter !== "all" && status !== statusFilter) {
            show = false;
        }
        if (machineFilter !== "all" && machine !== machineFilter) {
            show = false;
        }
        row.style.display = show ? "" : "none";
    }
}

// Toggle filter options in Generate Todo modal
function toggleFilterOptions() {
    const filterTypeElement = document.getElementById('filterType');
    if (!filterTypeElement) return;

    const daysSection = document.getElementById('daysFilterSection');
    const dateRangeSection = document.getElementById('dateRangeFilterSection');

    if (!daysSection || !dateRangeSection) return;

    if (filterTypeElement.value === 'days') {
        daysSection.style.display = 'block';
        dateRangeSection.style.display = 'none';
    } else {
        daysSection.style.display = 'none';
        dateRangeSection.style.display = 'block';
    }
}
