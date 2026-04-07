const _n = new Date()
const _cm = (d) => new Date(_n.getFullYear(), _n.getMonth(), d).toISOString()

export const INITIAL_USERS = [
  { id: 1, name: 'Maria Santos', username: 'admin', password: 'admin123', role: 'admin', lastLogin: new Date().toISOString(), status: 'Active' },
  { id: 2, name: 'Juan Cruz', username: 'staff', password: 'staff123', role: 'staff', lastLogin: new Date().toISOString(), status: 'Active' },
]

export const INITIAL_ICE_STOCK = { qty: 200, threshold: 50, costPerBlock: 18, vendor: 1 }

export const INITIAL_VENDORS = [
  { id: 1, name: 'Polar Ice Supply', contact: 'Juan Dela Cruz', phone: '0917-555-0101', email: 'juan@polarice.ph', terms: 'Net 7', city: 'Cebu City', notes: 'Main block supplier.' },
  { id: 2, name: 'CoolFreeze Corp.', contact: 'Ana Reyes', phone: '0918-555-0202', email: 'ana@coolfreeze.ph', terms: 'COD', city: 'Mandaue City', notes: '' },
]

export const INITIAL_SERVICES = [
  { id: 1, name: 'Crushing', price: 5, unit: 'per block', desc: 'Crushed ice processing' },
  { id: 2, name: 'Cubing', price: 8, unit: 'per block', desc: 'Ice cubed processing' },
  { id: 3, name: 'Tubing', price: 6, unit: 'per block', desc: 'Ice tube processing' },
  { id: 4, name: 'Rush Delivery', price: 150, unit: 'flat fee', desc: 'Same-day delivery surcharge' },
  { id: 5, name: 'Delivery', price: 75, unit: 'flat fee', desc: 'Standard delivery fee' },
]

export const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Jollibee Colon', contact: 'Mark Tan', phone: '0917-100-0001', email: '', area: 'Colon St, Cebu City', notes: '' },
  { id: 2, name: 'SM City Cebu', contact: 'Lisa Park', phone: '0917-100-0002', email: '', area: 'SM City Cebu', notes: 'Large volume weekly' },
  { id: 3, name: 'Ayala Restaurants', contact: 'Carlo M.', phone: '0917-100-0003', email: '', area: 'Ayala Center Cebu', notes: '' },
  { id: 4, name: 'Public Market Vendors', contact: 'Pedro Cruz', phone: '0917-100-0004', email: '', area: 'Carbon Market', notes: 'Daily supply' },
  { id: 5, name: 'Port Area Fisheries', contact: 'Jose Santos', phone: '0917-100-0005', email: '', area: 'Cebu Port', notes: '' },
]

export const INITIAL_ORDERS = [
  { id: 'ORD-001', customerId: 1, date: _cm(2), lines: [{ qty: 140, pricePerBlock: 25, serviceIds: [1] }], blocks: 140, pricePerBlock: 25, total: 3640, notes: '', status: 'Paid', payment: { method: 'Cash', date: _cm(3), checkNum: '', amount: 3640, staff: 'Maria Santos', notes: '', photo: null } },
  { id: 'ORD-002', customerId: 2, date: _cm(3), lines: [{ qty: 150, pricePerBlock: 25, serviceIds: [1, 4] }], blocks: 150, pricePerBlock: 25, total: 4150, notes: '', status: 'Overdue', payment: null },
  { id: 'ORD-003', customerId: 3, date: _cm(8), lines: [{ qty: 100, pricePerBlock: 25, serviceIds: [2] }], blocks: 100, pricePerBlock: 25, total: 2820, notes: '', status: 'Unpaid', payment: null },
  { id: 'ORD-004', customerId: 4, date: _cm(14), lines: [{ qty: 112, pricePerBlock: 25, serviceIds: [5] }], blocks: 112, pricePerBlock: 25, total: 2875, notes: 'Weekly supply', status: 'Unpaid', payment: null },
  { id: 'ORD-005', customerId: 5, date: _cm(18), lines: [{ qty: 200, pricePerBlock: 25, serviceIds: [4] }], blocks: 200, pricePerBlock: 25, total: 5150, notes: '', status: 'Unpaid', payment: null },
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

export const ADMIN_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'checkinout', label: 'Stock Log' },
  { id: 'tools-cio', label: 'Check-In/Out' },
  { id: 'orders', label: 'Orders' },
  { id: 'services', label: 'Services' },
  { id: 'customers', label: 'Customers' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'users', label: 'Users' },
]

export const STAFF_TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'checkinout', label: 'Stock Log' },
  { id: 'tools-cio', label: 'Check-In/Out' },
  { id: 'orders', label: 'Orders' },
  { id: 'customers', label: 'Customers' },
]
