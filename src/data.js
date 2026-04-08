const _n = new Date()
const _cm = (d) => new Date(_n.getFullYear(), _n.getMonth(), d).toISOString()
const _addDays = (iso, d) => { const dt = new Date(iso); dt.setDate(dt.getDate() + d); return dt.toISOString() }

export const DAILY_CAPACITY = 576 // blocks per day

export const INITIAL_USERS = [
  { id: 1, name: 'Maria Santos', username: 'admin', password: 'admin123', role: 'admin', lastLogin: new Date().toISOString(), status: 'Active' },
  { id: 2, name: 'Juan Cruz', username: 'assistant', password: 'asst123', role: 'assistant', lastLogin: new Date().toISOString(), status: 'Active' },
  { id: 3, name: 'Pedro Reyes', username: 'operator', password: 'op123', role: 'operator', lastLogin: new Date().toISOString(), status: 'Active' },
  { id: 4, name: 'Rosa Lim', username: 'staff', password: 'staff123', role: 'staff', lastLogin: new Date().toISOString(), status: 'Active' },
]

export const INITIAL_ICE_STOCK = { qty: 200, threshold: 50, costPerBlock: 18, vendor: 1 }

export const INITIAL_VENDORS = [
  { id: 1, name: 'Polar Ice Supply', contact: 'Juan Dela Cruz', phone: '0917-555-0101', email: 'juan@polarice.ph', terms: 'Net 7', city: 'Cebu City', notes: 'Main block supplier.' },
  { id: 2, name: 'CoolFreeze Corp.', contact: 'Ana Reyes', phone: '0918-555-0202', email: 'ana@coolfreeze.ph', terms: 'COD', city: 'Mandaue City', notes: '' },
  { id: 3, name: 'OLC Vendor', contact: '', phone: '', email: '', terms: 'COD', city: 'Cebu City', notes: '' },
]

export const INITIAL_SERVICES = [
  { id: 1, name: 'Crushing', price: 5, unit: 'per block', desc: 'Crushed ice processing' },
  { id: 2, name: 'Cubing', price: 8, unit: 'per block', desc: 'Ice cubed processing' },
  { id: 3, name: 'Tubing', price: 6, unit: 'per block', desc: 'Ice tube processing' },
  { id: 4, name: 'Rush Delivery', price: 150, unit: 'flat fee', desc: 'Same-day delivery surcharge' },
  { id: 5, name: 'Delivery', price: 75, unit: 'flat fee', desc: 'Standard delivery fee' },
]

// Customer SOA/OLC/Invoice numbering settings included
export const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Jollibee Colon', contact: 'Mark Tan', phone: '0917-100-0001', email: '', area: 'Colon St, Cebu City', notes: '', soaStartNum: 1, invoiceStartNum: 1, olcStartNum: 1 },
  { id: 2, name: 'SM City Cebu', contact: 'Lisa Park', phone: '0917-100-0002', email: '', area: 'SM City Cebu', notes: 'Large volume weekly', soaStartNum: 1, invoiceStartNum: 1, olcStartNum: 1 },
  { id: 3, name: 'Ayala Restaurants', contact: 'Carlo M.', phone: '0917-100-0003', email: '', area: 'Ayala Center Cebu', notes: '', soaStartNum: 1, invoiceStartNum: 1, olcStartNum: 1 },
  { id: 4, name: 'Public Market Vendors', contact: 'Pedro Cruz', phone: '0917-100-0004', email: '', area: 'Carbon Market', notes: 'Daily supply', soaStartNum: 1, invoiceStartNum: 1, olcStartNum: 1 },
  { id: 5, name: 'Port Area Fisheries', contact: 'Jose Santos', phone: '0917-100-0005', email: '', area: 'Cebu Port', notes: '', soaStartNum: 1, invoiceStartNum: 1, olcStartNum: 1 },
]

// Orders now include: deliveryStatus (Pending/Sent/Delivered), invoiced flag, dr_number, plate_number, created_by
export const INITIAL_ORDERS = [
  { id: 'ORD-001', customerId: 1, date: _cm(2), invoiceDate: _cm(2), dueDate: _addDays(_cm(2), 7), deliveryStatus: 'Delivered', dr_number: 'DR-001', plate_number: 'ABC 123', created_by: 'Maria Santos', created_at: _cm(2), invoiced: true, lines: [{ qty: 140, pricePerBlock: 25, serviceIds: [1] }], blocks: 140, pricePerBlock: 25, total: 3640, notes: '', status: 'Paid', payment: { method: 'Cash', date: _cm(3), checkNum: '', amount: 3640, staff: 'Maria Santos', notes: '', photo: null } },
  { id: 'ORD-002', customerId: 2, date: _cm(3), invoiceDate: _cm(3), dueDate: _addDays(_cm(3), 7), deliveryStatus: 'Sent', dr_number: 'DR-002', plate_number: 'XYZ 456', created_by: 'Maria Santos', created_at: _cm(3), invoiced: false, lines: [{ qty: 150, pricePerBlock: 25, serviceIds: [1, 4] }], blocks: 150, pricePerBlock: 25, total: 4150, notes: '', status: 'Overdue', payment: null },
  { id: 'ORD-003', customerId: 3, date: _cm(8), invoiceDate: _cm(8), dueDate: _addDays(_cm(8), 7), deliveryStatus: 'Sent', dr_number: 'DR-003', plate_number: '', created_by: 'Maria Santos', created_at: _cm(8), invoiced: false, lines: [{ qty: 100, pricePerBlock: 25, serviceIds: [2] }], blocks: 100, pricePerBlock: 25, total: 2820, notes: '', status: 'Unpaid', payment: null },
  { id: 'ORD-004', customerId: 4, date: _cm(14), invoiceDate: _cm(14), dueDate: _addDays(_cm(14), 7), deliveryStatus: 'Pending', dr_number: '', plate_number: '', created_by: 'Maria Santos', created_at: _cm(14), invoiced: false, lines: [{ qty: 112, pricePerBlock: 25, serviceIds: [5] }], blocks: 112, pricePerBlock: 25, total: 2875, notes: 'Weekly supply', status: 'Unpaid', payment: null },
  { id: 'ORD-005', customerId: 5, date: _cm(18), invoiceDate: _cm(18), dueDate: _addDays(_cm(18), 7), deliveryStatus: 'Pending', dr_number: '', plate_number: '', created_by: 'Maria Santos', created_at: _cm(18), invoiced: false, lines: [{ qty: 200, pricePerBlock: 25, serviceIds: [4] }], blocks: 200, pricePerBlock: 25, total: 5150, notes: '', status: 'Unpaid', payment: null },
]

export const INITIAL_CIO_RECORDS = [
  { id: 1, type: 'in', qty: 500, staff: 'Pedro Reyes', ref: 'Morning production run — Machine 1 & 2', date: new Date(_n.getFullYear(), _n.getMonth(), 1).toISOString() },
  { id: 2, type: 'out', qty: 140, staff: 'Order ORD-001', ref: 'Jollibee Colon', date: new Date(_n.getFullYear(), _n.getMonth(), 2).toISOString() },
  { id: 3, type: 'out', qty: 150, staff: 'Order ORD-002', ref: 'SM City Cebu', date: new Date(_n.getFullYear(), _n.getMonth(), 3).toISOString() },
  { id: 4, type: 'in', qty: 300, staff: 'Jose Santos', ref: 'Afternoon production run', date: new Date(_n.getFullYear(), _n.getMonth(), 10).toISOString() },
]

export const INITIAL_ROUTES = [
  { id: 1, name: 'Route A — North', driver: 'Pedro Reyes', vehicle: 'Toyota Hi-Ace PHL 123', stops: 'Barangay 1, Barangay 2, Public Market', status: 'Active' },
  { id: 2, name: 'Route B — South', driver: 'Carlo Mendoza', vehicle: 'Isuzu Elf CEL 456', stops: 'Port Area, SM South, Jollibee Colon', status: 'On Route' },
]

export const INITIAL_TOOL_ITEMS = [
  { id: 1, name: 'Ice Pick', category: 'Hand Tool', qty: 10, condition: 'Good', notes: '' },
  { id: 2, name: 'Ice Tongs', category: 'Hand Tool', qty: 8, condition: 'Good', notes: '' },
  { id: 3, name: 'Ice Saw', category: 'Cutting Tool', qty: 3, condition: 'Good', notes: '' },
  { id: 4, name: 'Ice Block Mold', category: 'Production', qty: 20, condition: 'Good', notes: '' },
]

export const EXPENSE_CATEGORIES = [
  'Utilities', 'Supplies', 'Maintenance', 'Salaries', 'Fuel', 'Packaging', 'Equipment', 'Office', 'Other'
]

export const INITIAL_EXPENSES = [
  { id: 1, date: _cm(5), vendor: 'Meralco', category: 'Utilities', description: 'Monthly electricity bill', amount: 12500, method: 'Bank Transfer', ref: 'REF-001', notes: '', enteredBy: 'Maria Santos', attachment: null, createdAt: _cm(5) },
  { id: 2, date: _cm(10), vendor: 'Shell Gas Station', category: 'Fuel', description: 'Truck fuel — delivery runs', amount: 3200, method: 'Cash', ref: '', notes: '', enteredBy: 'Maria Santos', attachment: null, createdAt: _cm(10) },
  { id: 3, date: _cm(15), vendor: 'ACE Hardware', category: 'Maintenance', description: 'Ice machine spare parts', amount: 1850, method: 'Cash', ref: 'REC-0234', notes: 'Machine 2 belt replacement', enteredBy: 'Maria Santos', attachment: null, createdAt: _cm(15) },
]

export const INITIAL_CLOCK_RECORDS = [
  { id: 1, userId: 3, userName: 'Pedro Reyes', clockIn: new Date(_n.getFullYear(), _n.getMonth(), _n.getDate(), 6, 0).toISOString(), clockOut: new Date(_n.getFullYear(), _n.getMonth(), _n.getDate(), 14, 0).toISOString(), totalHours: 8, notes: '' },
  { id: 2, userId: 4, userName: 'Rosa Lim', clockIn: new Date(_n.getFullYear(), _n.getMonth(), _n.getDate(), 7, 30).toISOString(), clockOut: new Date(_n.getFullYear(), _n.getMonth(), _n.getDate(), 15, 30).toISOString(), totalHours: 8, notes: '' },
]

export const INITIAL_BROKEN_ICE = [
  { id: 1, weight: 29, unit: 'kg', blockEquivalent: 20, enteredBy: 'Pedro Reyes', date: _cm(5), notes: 'Broken during production run' },
  { id: 2, weight: 14.5, unit: 'kg', blockEquivalent: 10, enteredBy: 'Pedro Reyes', date: _cm(12), notes: 'Dropped blocks' },
]

// SOAs (Statement of Account)
export const INITIAL_SOAS = []

// Tabs per role
export const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'checkinout', label: 'Stock Log' },
  { id: 'tools-cio', label: 'Check-In/Out' },
  { id: 'orders', label: 'Orders' },
  { id: 'soa', label: 'SOA' },
  { id: 'services', label: 'Services' },
  { id: 'customers', label: 'Customers' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'users', label: 'Users' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'reports', label: 'Reports' },
  { id: 'clock', label: 'Clock In/Out' },
]

export const ASSISTANT_TABS = [
  { id: 'inventory', label: 'Inventory' },
  { id: 'checkinout', label: 'Stock Log' },
  { id: 'tools-cio', label: 'Check-In/Out' },
  { id: 'orders', label: 'Orders' },
  { id: 'soa', label: 'SOA' },
  { id: 'services', label: 'Services' },
  { id: 'customers', label: 'Customers' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'expenses', label: 'Expenses' },
  { id: 'reports', label: 'Reports' },
]

export const OPERATOR_TABS = [
  { id: 'checkinout', label: 'Stock Log' },
  { id: 'clock', label: 'Clock In/Out' },
]

export const STAFF_TABS = [
  { id: 'clock', label: 'Clock In/Out' },
]
