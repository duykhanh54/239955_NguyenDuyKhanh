import { useEffect, useState } from 'react';
import './App.css';

const API = '/api/employees';

const emptyForm = {
  employeeId: '',
  fullName: '',
  gender: 'Nam',
  dateOfBirth: '',
  department: '',
  position: '',
  email: '',
  phone: '',
  hireDate: '',
  status: 'Dang lam viec'
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadEmployees(keyword = search) {
    try {
      setLoading(true);
      const response = await fetch(`${API}?search=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không tải được dữ liệu');
      setEmployees(data);
    } catch (error) {
      setMessage(`Lỗi kết nối: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees('');
  }, []);

  function changeForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setMessage('');

    try {
      const url = editingId ? `${API}/${editingId}` : API;
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Không thể lưu nhân viên');

      setMessage(editingId ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
      setForm(emptyForm);
      setEditingId(null);
      await loadEmployees();
    } catch (error) {
      setMessage(`Lỗi: ${error.message}`);
    }
  }

  function editEmployee(employee) {
    setEditingId(employee._id);
    setForm({
      employeeId: employee.employeeId || '',
      fullName: employee.fullName || '',
      gender: employee.gender || 'Nam',
      dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : '',
      department: employee.department || '',
      position: employee.position || '',
      email: employee.email || '',
      phone: employee.phone || '',
      hireDate: employee.hireDate ? employee.hireDate.slice(0, 10) : '',
      status: employee.status || 'Dang lam viec'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function deleteEmployee(employee) {
    if (!window.confirm(`Bạn có chắc muốn xóa ${employee.fullName}?`)) return;

    try {
      const response = await fetch(`${API}/${employee._id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Không thể xóa');
      setMessage('Xóa nhân viên thành công!');
      await loadEmployees();
    } catch (error) {
      setMessage(`Lỗi: ${error.message}`);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
  }

  return (
    <main className="container">
      <header className="header">
        <div>
          <p className="eyebrow">HỆ THỐNG NỘI BỘ</p>
          <h1>Quản lý nhân sự</h1>
          <p className="subtitle">Theo dõi hồ sơ và thông tin nhân viên</p>
        </div>
        <div className="total">
          <span>Tổng nhân viên</span>
          <strong>{employees.length}</strong>
        </div>
      </header>

      {message && <div className="message">{message}</div>}

      <section className="panel">
        <h2>{editingId ? 'Cập nhật nhân viên' : 'Thêm nhân viên mới'}</h2>
        <form className="employee-form" onSubmit={saveEmployee}>
          <label>Mã nhân viên *
            <input name="employeeId" value={form.employeeId} onChange={changeForm} required />
          </label>
          <label>Họ và tên *
            <input name="fullName" value={form.fullName} onChange={changeForm} required />
          </label>
          <label>Giới tính
            <select name="gender" value={form.gender} onChange={changeForm}>
              <option>Nam</option><option>Nu</option><option>Khac</option>
            </select>
          </label>
          <label>Ngày sinh
            <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={changeForm} />
          </label>
          <label>Phòng ban
            <input name="department" value={form.department} onChange={changeForm} />
          </label>
          <label>Chức vụ
            <input name="position" value={form.position} onChange={changeForm} />
          </label>
          <label>Email *
            <input type="email" name="email" value={form.email} onChange={changeForm} required />
          </label>
          <label>Số điện thoại
            <input name="phone" value={form.phone} onChange={changeForm} />
          </label>
          <label>Ngày vào làm
            <input type="date" name="hireDate" value={form.hireDate} onChange={changeForm} />
          </label>
          <label>Trạng thái
            <select name="status" value={form.status} onChange={changeForm}>
              <option value="Dang lam viec">Đang làm việc</option>
              <option value="Tam nghi">Tạm nghỉ</option>
              <option value="Da nghi viec">Đã nghỉ việc</option>
            </select>
          </label>
          <div className="form-actions">
            <button className="primary" type="submit">{editingId ? 'Lưu thay đổi' : 'Thêm nhân viên'}</button>
            {editingId && <button className="secondary" type="button" onClick={cancelEdit}>Hủy</button>}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="list-heading">
          <div>
            <h2>Danh sách nhân viên</h2>
            <p className="subtitle">Dữ liệu được lấy từ MongoDB Atlas</p>
          </div>
          <form className="search" onSubmit={(event) => { event.preventDefault(); loadEmployees(search); }}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm mã, tên, phòng ban..." />
            <button className="primary" type="submit">Tìm kiếm</button>
            <button className="secondary" type="button" onClick={() => { setSearch(''); loadEmployees(''); }}>Đặt lại</button>
          </form>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã NV</th><th>Họ và tên</th><th>Phòng ban</th><th>Chức vụ</th>
                <th>Email</th><th>Điện thoại</th><th>Trạng thái</th><th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td>{employee.employeeId}</td>
                  <td><strong>{employee.fullName}</strong></td>
                  <td>{employee.department || '—'}</td>
                  <td>{employee.position || '—'}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone || '—'}</td>
                  <td><span className="status">{employee.status}</span></td>
                  <td className="actions">
                    <button className="edit" onClick={() => editEmployee(employee)}>Sửa</button>
                    <button className="delete" onClick={() => deleteEmployee(employee)}>Xóa</button>
                  </td>
                </tr>
              ))}
              {!loading && employees.length === 0 && (
                <tr><td colSpan="8" className="empty">Chưa có nhân viên. Hãy thêm nhân viên ở biểu mẫu phía trên.</td></tr>
              )}
              {loading && <tr><td colSpan="8" className="empty">Đang tải dữ liệu...</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
      <footer>Hệ thống quản lý nhân sự · Cloud Computing · 2026</footer>
    </main>
  );
}

export default App;
