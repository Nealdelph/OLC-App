import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Chart, registerables } from 'chart.js'
import {
  INITIAL_USERS, INITIAL_ICE_STOCK, INITIAL_VENDORS, INITIAL_SERVICES,
  INITIAL_CUSTOMERS, INITIAL_ORDERS, INITIAL_CIO_RECORDS, INITIAL_ROUTES,
  INITIAL_TOOL_ITEMS, INITIAL_EXPENSES, INITIAL_CLOCK_RECORDS, INITIAL_BROKEN_ICE,
  INITIAL_SOAS, INITIAL_FEATURE_FLAGS, ALL_PAGES, EXPENSE_CATEGORIES, DAILY_CAPACITY,
  ADMIN_TABS, ASSISTANT_TABS, OPERATOR_TABS, STAFF_TABS, SUPERADMIN_TABS
} from './data.js'
import { peso, avColor, initials, computeStock, getCustomer, getService } from './utils.js'

Chart.register(...registerables)


const SEARCH_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

export default function App() {
  // Auth
  const [currentUser, setCurrentUser] = useState(null)
  // Navigation
  const [page, setPage] = useState('dashboard')
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Core data
  const [iceStock, setIceStock] = useState(INITIAL_ICE_STOCK)
  const [vendors, setVendors] = useState(INITIAL_VENDORS)
  const [services, setServices] = useState(INITIAL_SERVICES)
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [cioRecords, setCioRecords] = useState(INITIAL_CIO_RECORDS)
  const [routes, setRoutes] = useState(INITIAL_ROUTES) // kept for data; delivery page removed
  const [appUsers, setAppUsers] = useState(INITIAL_USERS)
  const [toolItems, setToolItems] = useState(INITIAL_TOOL_ITEMS)
  const [toolCIORecords, setToolCIORecords] = useState([])
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES)
  const [clockRecords, setClockRecords] = useState(INITIAL_CLOCK_RECORDS)
  const [brokenIce, setBrokenIce] = useState(INITIAL_BROKEN_ICE)
  const [soas, setSoas] = useState(INITIAL_SOAS)
  const [featureFlags, setFeatureFlags] = useState(INITIAL_FEATURE_FLAGS)
  // ID counters
  const nextOrderNum = useRef(6)
  const nextVendorId = useRef(10)
  const nextRouteId = useRef(10)
  const nextServiceId = useRef(10)
  const nextCustomerId = useRef(10)
  const nextCIOId = useRef(10)
  const nextUserId = useRef(10)
  const nextToolId = useRef(10)
  const nextToolCIOId = useRef(1)
  const nextExpenseId = useRef(10)
  const nextClockId = useRef(10)
  const nextBrokenIceId = useRef(10)
  const nextOlcNum = useRef(1) // global OLC counter
  // Modal
  const [modal, setModal] = useState(null)
  // Edit IDs
  const [editServiceId, setEditServiceId] = useState(null)
  const [editCustomerId, setEditCustomerId] = useState(null)
  const [editVendorId, setEditVendorId] = useState(null)
  const [editRouteId, setEditRouteId] = useState(null)
  const [editUserId, setEditUserId] = useState(null)
  const [editToolId, setEditToolId] = useState(null)
  const [viewingOrderId, setViewingOrderId] = useState(null)
  const [markingPaidId, setMarkingPaidId] = useState(null)
  const [photoDataUrl, setPhotoDataUrl] = useState(null)
  // Customer detail
  const [viewingCustomerId, setViewingCustomerId] = useState(null)
  // Order form
  const [orderLines, setOrderLines] = useState([])
  const orderLineCounter = useRef(0)
  const [orderForm, setOrderForm] = useState({ customerId: '', date: '', invoiceDate: '', dueDate: '', drNumber: '', plateNumber: '', deliveryStatus: 'Pending', notes: '', defaultPrice: '25' })
  // Paid form
  const [paidForm, setPaidForm] = useState({ method: 'Cash', date: '', checkNum: '', amount: '', staff: '', notes: '' })
  // Service form
  const [serviceForm, setServiceForm] = useState({ name: '', price: '', unit: '', desc: '' })
  // Customer form
  const [customerForm, setCustomerForm] = useState({ name: '', contact: '', phone: '', email: '', area: '', notes: '', soaStartNum: '1', invoiceStartNum: '1', olcStartNum: '1' })
  // Vendor form
  const [vendorForm, setVendorForm] = useState({ name: '', contact: '', phone: '', email: '', terms: 'COD', city: '', notes: '' })
  // Route form
  const [routeForm, setRouteForm] = useState({ name: '', driver: '', vehicle: '', status: 'Active', stops: '' })
  // User form
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'staff' })
  // Tool form
  const [toolForm, setToolForm] = useState({ name: '', category: '', qty: '1', condition: 'Good', notes: '' })
  // Stock settings form
  const [stockForm, setStockForm] = useState({ costPerBlock: '', threshold: '', vendor: '' })
  // Expense form
  const [expenseForm, setExpenseForm] = useState({ date: '', vendor: '', category: '', description: '', amount: '', method: 'Cash', ref: '', notes: '' })
  const [editExpenseId, setEditExpenseId] = useState(null)
  const [expenseSearch, setExpenseSearch] = useState('')
  const [expenseCatFilter, setExpenseCatFilter] = useState('All')
  // Clock form
  const [clockForm, setClockForm] = useState({ userId: '', clockIn: '', clockOut: '', notes: '' })
  const [clockSearch, setClockSearch] = useState('')
  // Broken ice form
  const [brokenForm, setBrokenForm] = useState({ weight: '', unit: 'kg', notes: '' })
  const [brokenSearch, setBrokenSearch] = useState('')
  const [soaCustFilter, setSoaCustFilter] = useState('')
  // CIO form
  const [cioForm, setCioForm] = useState({ qty: '', staff: '', ref: '' })
  // Tool CIO form
  const [tcioForm, setTcioForm] = useState({ type: 'checkout', toolId: '', qty: '', staff: '', notes: '' })
  // Searches
  const [dashRange, setDashRange] = useState(30)
  const [orderSearch, setOrderSearch] = useState('')
  const [orderFilter, setOrderFilter] = useState('All')
  const [custSearch, setCustSearch] = useState('')
  const [reminderDays, setReminderDays] = useState(3)
  const [vendorSearch, setVendorSearch] = useState('')
  const [cioSearch, setCioSearch] = useState('')
  const [cioFilter, setCioFilter] = useState('All')
  const [tcioSearch, setTcioSearch] = useState('')
  const [tcioFilter, setTcioFilter] = useState('All')
  // Toast
  const [toasts, setToasts] = useState([])
  // Login form
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginError, setLoginError] = useState(false)

  const toast = useCallback((msg) => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  const curStock = computeStock(cioRecords)
  const ROLE_TABS = { superadmin: SUPERADMIN_TABS, admin: ADMIN_TABS, assistant: ASSISTANT_TABS, operator: OPERATOR_TABS, staff: STAFF_TABS }
  const rawTabs = currentUser ? (ROLE_TABS[currentUser.role] || STAFF_TABS) : []
  // Filter tabs by feature flags (superadmin always sees all)
  const tabs = currentUser?.role === 'superadmin'
    ? rawTabs
    : rawTabs.filter(t => featureFlags.pages[t.id] !== false)

  function loginWith(username, password) {
    const found = appUsers.find(u => u.username === username.trim() && u.password === password && u.status === 'Active')
    if (!found) { setLoginError(true); return }
    setLoginError(false)
    const userTabs = ROLE_TABS[found.role] || STAFF_TABS
    const allowedTabs = found.role === 'superadmin' ? userTabs : userTabs.filter(t => featureFlags.pages[t.id] !== false)
    const firstPage = allowedTabs[0]?.id || 'dashboard'
    setCurrentUser({ ...found, lastLogin: new Date().toISOString() })
    setPage(firstPage)
  }

  function doLogin() { loginWith(loginUser, loginPass) }

  function doLogout() {
    setCurrentUser(null); setPage('dashboard'); setDrawerOpen(false); setModal(null)
    setLoginUser(''); setLoginPass('')
  }

  function openModal(name) { setModal(name); document.body.style.overflow = 'hidden' }
  function closeModal() { setModal(null); document.body.style.overflow = '' }

  // ── ORDER LINES ──
  function addOrderLine() {
    const id = ++orderLineCounter.current
    setOrderLines(prev => [...prev, { id, qty: '', pricePerBlock: orderForm.defaultPrice, selectedSvcIds: [] }])
  }
  function removeOrderLine(id) { setOrderLines(prev => prev.filter(l => l.id !== id)) }
  function updateLine(id, field, val) {
    setOrderLines(prev => prev.map(l => l.id === id ? { ...l, [field]: val } : l))
  }
  function toggleAddon(lineId, svcId) {
    setOrderLines(prev => prev.map(l => {
      if (l.id !== lineId) return l
      const has = l.selectedSvcIds.includes(svcId)
      return { ...l, selectedSvcIds: has ? l.selectedSvcIds.filter(s => s !== svcId) : [...l.selectedSvcIds, svcId] }
    }))
  }

  function calcLineTotal(line) {
    const qty = parseFloat(line.qty) || 0
    const price = parseFloat(line.pricePerBlock) || 0
    const svcTotal = line.selectedSvcIds.reduce((s, sid) => {
      const svc = services.find(sv => sv.id === sid)
      return s + (svc ? svc.price * qty : 0)
    }, 0)
    return qty * price + svcTotal
  }

  const orderGrandTotal = orderLines.reduce((s, l) => s + calcLineTotal(l), 0)
  const orderTotalBlocks = orderLines.reduce((s, l) => s + (parseInt(l.qty) || 0), 0)

  function openCreateOrder() {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') { toast('Admin access required'); return }
    const defaultPrice = iceStock.costPerBlock > 0 ? String(Math.round(iceStock.costPerBlock * 1.5)) : '25'
    const today = new Date().toISOString().split('T')[0]
    const due = new Date(); due.setDate(due.getDate() + 7)
    const dueStr = due.toISOString().split('T')[0]
    setOrderForm({ customerId: '', date: today, invoiceDate: today, dueDate: dueStr, drNumber: '', plateNumber: '', deliveryStatus: 'Pending', notes: '', defaultPrice })
    orderLineCounter.current = 0
    setOrderLines([])
    setModal('order')
    setTimeout(() => {
      const id = ++orderLineCounter.current
      setOrderLines([{ id, qty: '', pricePerBlock: defaultPrice, selectedSvcIds: [] }])
    }, 10)
  }

  function saveOrder() {
    if (!orderForm.customerId) { toast('Select a customer'); return }
    const lines = orderLines.filter(l => parseInt(l.qty) > 0)
    if (!lines.length) { toast('Add at least one line with blocks'); return }
    for (const l of lines) {
      if (!(parseFloat(l.pricePerBlock) > 0)) { toast('Enter price per block for each line'); return }
    }
    const totalBlocks = lines.reduce((s, l) => s + parseInt(l.qty), 0)
    if (curStock < totalBlocks) { toast(`Not enough stock — only ${curStock} blocks available`); return }
    const total = lines.reduce((s, l) => s + calcLineTotal(l), 0)
    const orderId = 'ORD-' + String(nextOrderNum.current++).padStart(3, '0')
    const newOrder = {
      id: orderId, customerId: parseInt(orderForm.customerId),
      date: orderForm.date + 'T00:00:00.000Z',
      invoiceDate: (orderForm.invoiceDate || orderForm.date) + 'T00:00:00.000Z',
      dueDate: orderForm.dueDate + 'T00:00:00.000Z',
      lines: lines.map(l => ({ qty: parseInt(l.qty), pricePerBlock: parseFloat(l.pricePerBlock), serviceIds: l.selectedSvcIds })),
      blocks: totalBlocks, pricePerBlock: parseFloat(lines[0].pricePerBlock), total, notes: orderForm.notes,
      status: 'Unpaid', payment: null,
      deliveryStatus: orderForm.deliveryStatus || 'Pending',
      dr_number: orderForm.drNumber.trim(),
      plate_number: orderForm.plateNumber.trim(),
      created_by: currentUser.name,
      created_at: new Date().toISOString(),
      approved_for_invoicing: false,
      invoiced: false
    }
    setOrders(prev => [newOrder, ...prev])
    setCioRecords(prev => [...prev, { id: nextCIOId.current++, type: 'out', qty: totalBlocks, staff: 'Order ' + orderId, ref: getCustomer(customers, parseInt(orderForm.customerId)).name, date: new Date().toISOString() }])
    closeModal()
    toast(`${orderId} created — ${totalBlocks} blocks checked out`)
  }

  // ── SERVICES ──
  function openServiceModal(id = null) {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') { toast('Admin access required'); return }
    setEditServiceId(id)
    if (id) {
      const s = services.find(sv => sv.id === id)
      setServiceForm({ name: s.name, price: String(s.price), unit: s.unit, desc: s.desc || '' })
    } else setServiceForm({ name: '', price: '', unit: '', desc: '' })
    openModal('service')
  }
  function saveService() {
    const { name, price, unit, desc } = serviceForm
    if (!name.trim()) return
    const s = { name: name.trim(), price: parseFloat(price) || 0, unit: unit.trim() || 'per order', desc: desc.trim() }
    if (editServiceId) { setServices(prev => prev.map(sv => sv.id === editServiceId ? { ...sv, ...s } : sv)); toast('Service updated') }
    else { setServices(prev => [...prev, { id: nextServiceId.current++, ...s }]); toast('Service added') }
    closeModal()
  }
  function deleteService(id) {
    if (!confirm('Delete this service?')) return
    setServices(prev => prev.filter(s => s.id !== id)); toast('Service deleted')
  }

  // ── CUSTOMERS ──
  function openCustomerModal(id = null) {
    setEditCustomerId(id)
    if (id) {
      const c = customers.find(cu => cu.id === id)
      setCustomerForm({ name: c.name, contact: c.contact || '', phone: c.phone || '', email: c.email || '', area: c.area || '', notes: c.notes || '', soaStartNum: String(c.soaStartNum ?? 1), invoiceStartNum: String(c.invoiceStartNum ?? 1), olcStartNum: String(c.olcStartNum ?? 1) })
    } else setCustomerForm({ name: '', contact: '', phone: '', email: '', area: '', notes: '', soaStartNum: '1', invoiceStartNum: '1', olcStartNum: '1' })
    openModal('customer')
  }
  function saveCustomer() {
    if (!customerForm.name.trim()) { toast('Enter customer name'); return }
    const c = { name: customerForm.name.trim(), contact: customerForm.contact.trim(), phone: customerForm.phone.trim(), email: customerForm.email.trim(), area: customerForm.area.trim(), notes: customerForm.notes.trim(), soaStartNum: parseInt(customerForm.soaStartNum) || 1, invoiceStartNum: parseInt(customerForm.invoiceStartNum) || 1, olcStartNum: parseInt(customerForm.olcStartNum) || 1 }
    if (editCustomerId) { setCustomers(prev => prev.map(cu => cu.id === editCustomerId ? { ...cu, ...c } : cu)); toast('Customer updated') }
    else { setCustomers(prev => [...prev, { id: nextCustomerId.current++, ...c }]); toast('Customer added') }
    closeModal()
  }
  function deleteCustomer(id) {
    if (orders.some(o => o.customerId === id && o.status !== 'Cancelled')) { toast('Cannot delete — customer has active orders'); return }
    if (!confirm('Delete customer?')) return
    setCustomers(prev => prev.filter(c => c.id !== id)); toast('Customer deleted')
  }

  // ── VENDORS ──
  function openVendorModal(id = null) {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') { toast('Admin access required'); return }
    setEditVendorId(id)
    if (id) {
      const v = vendors.find(vn => vn.id === id)
      setVendorForm({ name: v.name, contact: v.contact || '', phone: v.phone || '', email: v.email || '', terms: v.terms, city: v.city || '', notes: v.notes || '' })
    } else setVendorForm({ name: '', contact: '', phone: '', email: '', terms: 'COD', city: '', notes: '' })
    openModal('vendor')
  }
  function saveVendor() {
    if (!vendorForm.name.trim()) return
    const v = { name: vendorForm.name.trim(), contact: vendorForm.contact.trim(), phone: vendorForm.phone.trim(), email: vendorForm.email.trim(), terms: vendorForm.terms, city: vendorForm.city.trim(), notes: vendorForm.notes.trim() }
    if (editVendorId) { setVendors(prev => prev.map(vn => vn.id === editVendorId ? { ...vn, ...v } : vn)); toast('Vendor updated') }
    else { setVendors(prev => [...prev, { id: nextVendorId.current++, ...v }]); toast('Vendor added') }
    closeModal()
  }
  function deleteVendor(id) {
    if (!confirm('Delete vendor?')) return
    setVendors(prev => prev.filter(v => v.id !== id)); toast('Vendor deleted')
  }

  // ── ROUTES ──
  function openRouteModal(id = null) {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') { toast('Admin access required'); return }
    setEditRouteId(id)
    if (id) {
      const r = routes.find(rt => rt.id === id)
      setRouteForm({ name: r.name, driver: r.driver || '', vehicle: r.vehicle || '', status: r.status, stops: r.stops || '' })
    } else setRouteForm({ name: '', driver: '', vehicle: '', status: 'Active', stops: '' })
    openModal('route')
  }
  function saveRoute() {
    if (!routeForm.name.trim()) return
    const r = { name: routeForm.name.trim(), driver: routeForm.driver.trim(), vehicle: routeForm.vehicle.trim(), status: routeForm.status, stops: routeForm.stops.trim() }
    if (editRouteId) { setRoutes(prev => prev.map(rt => rt.id === editRouteId ? { ...rt, ...r } : rt)); toast('Route updated') }
    else { setRoutes(prev => [...prev, { id: nextRouteId.current++, ...r }]); toast('Route added') }
    closeModal()
  }
  function deleteRoute(id) { if (!confirm('Delete route?')) return; setRoutes(prev => prev.filter(r => r.id !== id)); toast('Route deleted') }
  function toggleRoute(id) {
    const cycle = { Active: 'On Route', 'On Route': 'Completed', Completed: 'Active', Inactive: 'Active' }
    setRoutes(prev => prev.map(r => r.id === id ? { ...r, status: cycle[r.status] || 'Active' } : r))
    const r = routes.find(r => r.id === id)
    toast('Route: ' + (cycle[r?.status] || 'Active'))
  }

  // ── USERS ──
  function openUserModal(id = null) {
    setEditUserId(id)
    if (id) {
      const u = appUsers.find(u => u.id === id)
      setUserForm({ name: u.name, username: u.username, password: '', role: u.role })
    } else setUserForm({ name: '', username: '', password: '', role: 'staff' })
    openModal('user')
  }
  function saveUser() {
    const { name, username, password, role } = userForm
    if (!name.trim() || !username.trim()) { toast('Name and username required'); return }
    if (!editUserId && !password) { toast('Password required'); return }
    if (appUsers.find(u => u.username === username.trim() && u.id !== editUserId)) { toast('Username taken'); return }
    if (editUserId) {
      setAppUsers(prev => prev.map(u => u.id === editUserId ? { ...u, name: name.trim(), username: username.trim(), role, ...(password ? { password } : {}) } : u))
      if (editUserId === currentUser.id) setCurrentUser(u => ({ ...u, name: name.trim(), role }))
      toast('User updated')
    } else {
      setAppUsers(prev => [...prev, { id: nextUserId.current++, name: name.trim(), username: username.trim(), password, role, lastLogin: new Date().toISOString(), status: 'Active' }])
      toast('User added')
    }
    closeModal()
  }
  function deleteUser(id) {
    if (id === currentUser.id) { toast('Cannot delete your account'); return }
    if (!confirm('Delete user?')) return
    setAppUsers(prev => prev.filter(u => u.id !== id)); toast('User deleted')
  }

  // ── TOOLS ──
  function openToolModal(id = null) {
    setEditToolId(id)
    if (id) {
      const t = toolItems.find(t => t.id === id)
      setToolForm({ name: t.name, category: t.category || '', qty: String(t.qty), condition: t.condition || 'Good', notes: t.notes || '' })
    } else setToolForm({ name: '', category: '', qty: '1', condition: 'Good', notes: '' })
    openModal('tool')
  }
  function saveTool() {
    if (!toolForm.name.trim()) { toast('Item name is required'); return }
    const item = { name: toolForm.name.trim(), category: toolForm.category.trim(), qty: parseInt(toolForm.qty) || 1, condition: toolForm.condition, notes: toolForm.notes.trim() }
    if (editToolId) { setToolItems(prev => prev.map(t => t.id === editToolId ? { ...t, ...item } : t)); toast('Item updated') }
    else { setToolItems(prev => [...prev, { id: nextToolId.current++, ...item }]); toast('Item added') }
    closeModal()
  }
  function deleteTool(id) { if (!confirm('Delete this item?')) return; setToolItems(prev => prev.filter(t => t.id !== id)); toast('Item deleted') }

  // ── TOOL CIO ──
  function submitToolCIO() {
    const { type, toolId, qty, staff, notes } = tcioForm
    const tid = parseInt(toolId)
    const q = parseInt(qty) || 0
    if (!tid) { toast('Select a tool'); return }
    if (q < 1) { toast('Quantity must be at least 1'); return }
    if (!staff.trim()) { toast('Staff / person is required'); return }
    const tool = toolItems.find(t => t.id === tid)
    if (type === 'checkout' && tool && tool.qty < q) { toast(`Not enough in stock (available: ${tool.qty})`); return }
    setToolItems(prev => prev.map(t => t.id === tid ? { ...t, qty: t.qty + (type === 'checkin' ? q : -q) } : t))
    setToolCIORecords(prev => [...prev, { id: nextToolCIOId.current++, toolId: tid, type, qty: q, staff: staff.trim(), notes: notes.trim(), date: new Date().toISOString() }])
    setTcioForm(f => ({ ...f, qty: '', staff: '', notes: '' }))
    toast(type === 'checkin' ? `Checked in: ${q} ${tool?.name}` : `Checked out: ${q} ${tool?.name}`)
  }

  // ── STOCK LOG ──
  function submitCIO() {
    const qty = parseInt(cioForm.qty) || 0
    if (qty <= 0) { toast('Enter quantity of blocks produced'); return }
    setCioRecords(prev => [...prev, { id: nextCIOId.current++, type: 'in', qty, staff: cioForm.staff.trim(), ref: cioForm.ref.trim(), date: new Date().toISOString() }])
    setCioForm({ qty: '', staff: '', ref: '' })
    toast(`${qty} blocks added to stock`)
  }

  // ── STOCK SETTINGS ──
  function openStockSettings() {
    setStockForm({ costPerBlock: String(iceStock.costPerBlock), threshold: String(iceStock.threshold), vendor: String(iceStock.vendor) })
    openModal('stockSettings')
  }
  function saveStockSettings() {
    setIceStock(s => ({ ...s, costPerBlock: parseFloat(stockForm.costPerBlock) || s.costPerBlock, threshold: parseInt(stockForm.threshold) || s.threshold, vendor: parseInt(stockForm.vendor) || s.vendor }))
    closeModal(); toast('Stock settings updated')
  }

  // ── EXPENSES ──
  function openExpenseModal(id = null) {
    setEditExpenseId(id)
    if (id) {
      const e = expenses.find(ex => ex.id === id)
      setExpenseForm({ date: e.date.split('T')[0], vendor: e.vendor, category: e.category, description: e.description, amount: String(e.amount), method: e.method, ref: e.ref, notes: e.notes })
    } else {
      setExpenseForm({ date: new Date().toISOString().split('T')[0], vendor: '', category: '', description: '', amount: '', method: 'Cash', ref: '', notes: '' })
    }
    openModal('expense')
  }
  function saveExpense() {
    if (!expenseForm.vendor.trim()) { toast('Enter vendor/payee'); return }
    if (!expenseForm.amount || parseFloat(expenseForm.amount) <= 0) { toast('Enter valid amount'); return }
    const ex = { vendor: expenseForm.vendor.trim(), category: expenseForm.category || 'Other', description: expenseForm.description.trim(), amount: parseFloat(expenseForm.amount), method: expenseForm.method, ref: expenseForm.ref.trim(), notes: expenseForm.notes.trim(), enteredBy: currentUser.name, date: expenseForm.date + 'T00:00:00.000Z', attachment: null }
    if (editExpenseId) { setExpenses(prev => prev.map(e => e.id === editExpenseId ? { ...e, ...ex } : e)); toast('Expense updated') }
    else { setExpenses(prev => [...prev, { id: nextExpenseId.current++, ...ex, createdAt: new Date().toISOString() }]); toast('Expense recorded') }
    closeModal()
  }
  function deleteExpense(id) { if (!confirm('Delete this expense?')) return; setExpenses(prev => prev.filter(e => e.id !== id)); toast('Expense deleted') }

  // ── CLOCK IN/OUT ──
  function submitClock() {
    const uid = parseInt(clockForm.userId)
    if (!uid) { toast('Select a user'); return }
    if (!clockForm.clockIn) { toast('Enter clock-in time'); return }
    const user = appUsers.find(u => u.id === uid)
    const ci = new Date(clockForm.clockIn)
    const co = clockForm.clockOut ? new Date(clockForm.clockOut) : null
    const totalHours = co ? parseFloat(((co - ci) / 3600000).toFixed(2)) : null
    setClockRecords(prev => [...prev, { id: nextClockId.current++, userId: uid, userName: user?.name || '?', clockIn: ci.toISOString(), clockOut: co ? co.toISOString() : null, totalHours, notes: clockForm.notes.trim() }])
    setClockForm({ userId: '', clockIn: '', clockOut: '', notes: '' })
    toast(`Clock entry logged for ${user?.name}`)
  }
  function clockOut(id) {
    const now = new Date().toISOString()
    setClockRecords(prev => prev.map(r => {
      if (r.id !== id) return r
      const totalHours = parseFloat(((new Date(now) - new Date(r.clockIn)) / 3600000).toFixed(2))
      return { ...r, clockOut: now, totalHours }
    }))
    toast('Clocked out')
  }
  function deleteClockRecord(id) { if (!confirm('Delete this record?')) return; setClockRecords(prev => prev.filter(r => r.id !== id)); toast('Record deleted') }

  // ── BROKEN ICE ──
  function submitBrokenIce() {
    const w = parseFloat(brokenForm.weight)
    if (!w || w <= 0) { toast('Enter weight'); return }
    const unit = brokenForm.unit
    const blockEquivalent = Math.round(w / (unit === 'kg' ? 1.45 : 3.2))
    setBrokenIce(prev => [...prev, { id: nextBrokenIceId.current++, weight: w, unit, blockEquivalent, enteredBy: currentUser.name, date: new Date().toISOString(), notes: brokenForm.notes.trim() }])
    setBrokenForm({ weight: '', unit: 'kg', notes: '' })
    toast(`${w}${unit} crushed ice logged (≈${blockEquivalent} block equiv.)`)
  }
  function deleteBrokenIce(id) { if (!confirm('Delete this entry?')) return; setBrokenIce(prev => prev.filter(r => r.id !== id)); toast('Entry deleted') }

  // ── ORDERS ── auto-flag overdue based on dueDate
  const autoFlaggedOrders = orders.map(o => {
    if (o.status === 'Unpaid' && o.dueDate && new Date(o.dueDate) < new Date()) return { ...o, status: 'Overdue' }
    return o
  })
  function markOverdue(id) { setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Overdue' } : o)); toast(id + ' marked as overdue') }

  function updateDeliveryStatus(orderId, deliveryStatus) {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus } : o))
    toast(`Order ${orderId} → ${deliveryStatus}`)
  }

  function toggleApproval(orderId) {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o
      const next = !o.approved_for_invoicing
      toast(`${orderId} ${next ? 'approved for SOA' : 'approval removed'}`)
      return { ...o, approved_for_invoicing: next }
    }))
  }

  function getWeekNumber(date) {
    const d = new Date(date); d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() + 4 - (d.getDay() || 7))
    const yearStart = new Date(d.getFullYear(), 0, 1)
    return { week: Math.ceil((((d - yearStart) / 86400000) + 1) / 7), year: d.getFullYear() }
  }

  function generateSOA(customerId, orderIds) {
    if (!orderIds.length) { toast('No orders selected'); return }
    const customer = customers.find(c => c.id === customerId)
    if (!customer) return
    // Count existing SOAs for this customer to get next SOA number
    const custSoas = soas.filter(s => s.customerId === customerId)
    const soaSeq = (customer.soaStartNum || 1) + custSoas.length
    const olcSeq = nextOlcNum.current++
    const { week, year } = getWeekNumber(new Date())
    const soaNumber = `SOA-${year}-W${String(week).padStart(2, '0')}-${String(soaSeq).padStart(4, '0')}`
    const olcNumber = String(olcSeq).padStart(4, '0')
    const selectedOrders = orders.filter(o => orderIds.includes(o.id))
    const total = selectedOrders.reduce((s, o) => s + o.total, 0)
    const newSOA = {
      id: soaNumber, soaNumber, olcNumber, customerId,
      orderIds, total,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
      dateRange: { from: selectedOrders.reduce((m, o) => o.date < m ? o.date : m, selectedOrders[0].date), to: selectedOrders.reduce((m, o) => o.date > m ? o.date : m, selectedOrders[0].date) }
    }
    setSoas(prev => [newSOA, ...prev])
    setOrders(prev => prev.map(o => orderIds.includes(o.id) ? { ...o, invoiced: true, soaNumber } : o))
    toast(`SOA ${soaNumber} generated — OLC #${olcNumber}`)
  }
  function viewOrder(id) { setViewingOrderId(id); openModal('invoiceView') }
  function cancelCurrentOrder() {
    const o = orders.find(o => o.id === viewingOrderId)
    if (!o) return
    if (o.status === 'Cancelled') { toast('Already cancelled'); return }
    if (!confirm('Cancel this order? Blocks will be returned to stock.')) return
    setOrders(prev => prev.map(ord => ord.id === viewingOrderId ? { ...ord, status: 'Cancelled' } : ord))
    setCioRecords(prev => [...prev, { id: nextCIOId.current++, type: 'restore', qty: o.blocks, staff: 'System', ref: 'Cancelled order ' + o.id, date: new Date().toISOString() }])
    closeModal(); toast('Order cancelled — blocks returned to stock')
  }
  function openMarkPaid(id) {
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'superadmin') { toast('Admin access required'); return }
    setMarkingPaidId(id)
    const o = orders.find(o => o.id === id)
    setPaidForm({ method: 'Cash', date: new Date().toISOString().split('T')[0], checkNum: '', amount: String(o?.total?.toFixed(2) || ''), staff: currentUser.name, notes: '' })
    setPhotoDataUrl(null)
    openModal('paid')
  }
  function confirmMarkPaid() {
    const { method, date, checkNum, amount, staff, notes } = paidForm
    if (!date) { toast('Enter payment date'); return }
    if (!staff.trim()) { toast('Enter staff name'); return }
    setOrders(prev => prev.map(o => o.id === markingPaidId ? { ...o, status: 'Paid', payment: { method, date: new Date(date).toISOString(), checkNum, amount: parseFloat(amount) || 0, staff: staff.trim(), notes: notes.trim(), photo: photoDataUrl } } : o))
    closeModal(); toast(`${markingPaidId} marked as paid by ${method}`)
    viewOrder(markingPaidId)
  }

  // ── CUSTOMERS — send reminder ──
  function sendReminder(cid) {
    const c = getCustomer(customers, cid)
    const unpaid = orders.filter(o => o.customerId === cid && (o.status === 'Unpaid' || o.status === 'Overdue'))
    if (!unpaid.length) { toast('No unpaid invoices for ' + c.name); return }
    const total = unpaid.reduce((s, o) => s + o.total, 0)
    toast(`Invoice reminder sent to ${c.name} — ${peso(total)} due`)
    setOrders(prev => prev.map(o => {
      if (o.customerId !== cid || o.status !== 'Unpaid') return o
      const daysOld = Math.floor((Date.now() - new Date(o.date).getTime()) / 86400000)
      return daysOld >= reminderDays ? { ...o, status: 'Overdue' } : o
    }))
  }

  // ── BUILD INVOICE HTML ──
  function buildInvoiceHTML(o) {
    if (!o) return ''
    const c = getCustomer(customers, o.customerId)
    const SB = { Paid: '#22c55e', Unpaid: '#0ea5e9', Overdue: '#ef4444', Cancelled: '#6b7280' }
    const fmt = (iso) => iso ? new Date(iso).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'
    const isOverdue = o.status === 'Overdue' || (o.status === 'Unpaid' && o.dueDate && new Date(o.dueDate) < new Date())
    const displayStatus = isOverdue ? 'Overdue' : o.status

    let lineRows = ''
    if (o.lines && o.lines.length > 0) {
      lineRows = `<table style="width:100%;border-collapse:collapse;font-size:12px;margin:8px 0;">
        <thead><tr style="border-bottom:1px solid var(--border);">
          <th style="text-align:left;padding:6px 4px;color:var(--text3);font-weight:600;">Description</th>
          <th style="text-align:right;padding:6px 4px;color:var(--text3);font-weight:600;">Qty</th>
          <th style="text-align:right;padding:6px 4px;color:var(--text3);font-weight:600;">Unit Price</th>
          <th style="text-align:right;padding:6px 4px;color:var(--text3);font-weight:600;">Amount</th>
        </tr></thead><tbody>` +
        o.lines.map(l => {
          const svcIds = l.serviceIds || (l.serviceId ? [l.serviceId] : [])
          const svcs = svcIds.map(id => getService(services, id)).filter(Boolean)
          const svcCost = svcs.reduce((s, svc) => s + svc.price * l.qty, 0)
          const lineTotal = l.qty * l.pricePerBlock + svcCost
          const svcLabel = svcs.length ? ' + ' + svcs.map(s => s.name).join(', ') : ''
          return `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
            <td style="padding:7px 4px;">Ice Blocks${svcLabel}</td>
            <td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);">${l.qty}</td>
            <td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);">${peso(l.pricePerBlock)}</td>
            <td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);font-weight:600;">${peso(lineTotal)}</td>
          </tr>` +
          (svcs.length ? svcs.map(s => `<tr><td style="padding:2px 4px 5px 14px;font-size:11px;color:var(--text3);">↳ ${s.name} ×${l.qty} @ ${peso(s.price)}</td><td></td><td></td><td style="padding:2px 4px 5px;text-align:right;font-family:var(--font-mono);font-size:11px;color:var(--text3);">${peso(s.price * l.qty)}</td></tr>`).join('') : '')
        }).join('') +
        `</tbody></table>`
    } else {
      const svcLines = (o.services || []).map(sv => { const svc = getService(services, sv.serviceId); return `<tr><td style="padding:7px 4px;">${svc.name}</td><td style="padding:7px 4px;text-align:right;">${sv.qty}</td><td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);">${peso(svc.price)}</td><td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);">${peso(svc.price * sv.qty)}</td></tr>` }).join('')
      lineRows = `<table style="width:100%;border-collapse:collapse;font-size:12px;margin:8px 0;">
        <thead><tr style="border-bottom:1px solid var(--border);"><th style="text-align:left;padding:6px 4px;color:var(--text3);">Description</th><th style="text-align:right;padding:6px 4px;color:var(--text3);">Qty</th><th style="text-align:right;padding:6px 4px;color:var(--text3);">Unit Price</th><th style="text-align:right;padding:6px 4px;color:var(--text3);">Amount</th></tr></thead>
        <tbody><tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:7px 4px;">Ice Blocks</td><td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);">${o.blocks}</td><td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);">${peso(o.pricePerBlock)}</td><td style="padding:7px 4px;text-align:right;font-family:var(--font-mono);font-weight:600;">${peso(o.blocks * o.pricePerBlock)}</td></tr>${svcLines}</tbody></table>`
    }

    return `<div class="receipt-header">
  <img src="/logo.png.png" alt="OLC Ice Plant" style="height:70px;object-fit:contain;" />
  <div class="receipt-sub">Official Invoice</div>
</div>
<div class="receipt-body">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
    <div>
      <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px;">Bill To</div>
      <div style="font-size:14px;font-weight:700;">${c.name}</div>
      ${c.contact ? `<div style="font-size:12px;color:var(--text2);">${c.contact}</div>` : ''}
      ${c.phone ? `<div style="font-size:12px;color:var(--text2);">${c.phone}</div>` : ''}
      ${c.area ? `<div style="font-size:12px;color:var(--text3);">${c.area}</div>` : ''}
    </div>
    <div style="text-align:right;">
      <div style="font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;">Invoice Details</div>
      <div style="font-size:12px;margin-bottom:2px;"><span style="color:var(--text3);">Invoice No:</span> <strong style="font-family:var(--font-mono);">${o.id}</strong></div>
      <div style="font-size:12px;margin-bottom:2px;"><span style="color:var(--text3);">Order Date:</span> ${fmt(o.date)}</div>
      <div style="font-size:12px;margin-bottom:2px;"><span style="color:var(--text3);">Invoice Date:</span> ${fmt(o.invoiceDate || o.date)}</div>
      <div style="font-size:12px;margin-bottom:4px;"><span style="color:var(--text3);">Due Date:</span> <strong style="color:${isOverdue ? '#ef4444' : '#f59e0b'};">${fmt(o.dueDate)}</strong></div>
      <span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${SB[displayStatus] || '#888'}22;color:${SB[displayStatus] || '#888'};border:1px solid ${SB[displayStatus] || '#888'}44;">${displayStatus}</span>
    </div>
  </div>
  <hr style="margin:10px 0;border-color:var(--border);">
  ${lineRows}
  ${o.notes ? `<div style="font-size:12px;color:var(--text2);padding:6px 0;font-style:italic;">Note: ${o.notes}</div>` : ''}
</div>
<div class="receipt-total"><span>Total Due</span><span style="font-family:var(--font-mono);">${peso(o.total)}</span></div>
${o.payment ? `<div style="padding:12px 16px;background:rgba(34,197,94,0.08);border-top:1px solid rgba(34,197,94,0.2);">
  <div style="font-size:12px;color:#22c55e;font-weight:700;margin-bottom:4px;">PAYMENT RECEIVED</div>
  <div style="font-size:12px;color:var(--text2);">${o.payment.method}${o.payment.checkNum ? ' · Check #' + o.payment.checkNum : ''}</div>
  <div style="font-size:12px;color:var(--text2);">Date: ${new Date(o.payment.date).toLocaleDateString('en-PH')} · Amount: ${peso(o.payment.amount)}</div>
  <div style="font-size:12px;color:var(--text2);">Received by: ${o.payment.staff}</div>
  ${o.payment.photo ? `<img src="${o.payment.photo}" style="width:100%;max-height:120px;object-fit:contain;border-radius:4px;margin-top:8px;">` : ''}
</div>` : ''}
<div class="receipt-footer">Thank you for your business.</div>`
  }

  // ── KEYBOARD CLOSE ──
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  if (!currentUser) return <LoginScreen loginUser={loginUser} setLoginUser={setLoginUser} loginPass={loginPass} setLoginPass={setLoginPass} loginError={loginError} onLogin={doLogin} onFill={(u, p) => loginWith(u, p)} />

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin'
  const isAssistant = currentUser.role === 'assistant'

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* Drawer overlay */}
      <div className={`drawer-overlay${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(false)} />
      {/* Drawer */}
      <div className={`drawer${drawerOpen ? ' open' : ''}`}>
        <div className="drawer-header">
          <img src="/logo.png.png" alt="OLC Ice Plant" style={{ height: 56, objectFit: 'contain' }} />
        </div>
        <div className="drawer-user">
          <div className="user-avatar" style={{ background: avColor(currentUser.name), width: 36, height: 36, fontSize: 13 }}>{initials(currentUser.name)}</div>
          <div className="drawer-user-info">
            <div className="drawer-user-name">{currentUser.name}</div>
            <div className="drawer-user-role">{currentUser.role}</div>
          </div>
        </div>
        <nav className="drawer-nav">
          {tabs.map(t => (
            <button key={t.id} className={`drawer-nav-item${page === t.id ? ' active' : ''}`} onClick={() => { setPage(t.id); setDrawerOpen(false) }}>
              <span className="dnav-dot" />{t.label}
            </button>
          ))}
        </nav>
        <div className="drawer-footer">
          <button className="btn btn-danger" style={{ width: '100%' }} onClick={doLogout}>Sign Out</button>
        </div>
      </div>

      {/* Top nav */}
      <nav className="topnav">
        <button className={`burger-btn${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <div className="nav-brand" style={{ marginLeft: 6 }}>
          <img src="/logo.png.png" alt="OLC Ice Plant" style={{ height: 40, objectFit: 'contain' }} />
        </div>
        <div className="nav-tabs">
          {tabs.map(t => (
            <button key={t.id} className={`nav-tab${page === t.id ? ' active' : ''}`} onClick={() => setPage(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="nav-right">
          <div className="user-pill">
            <div className="user-avatar" style={{ background: avColor(currentUser.name) }}>{initials(currentUser.name)}</div>
            <div>
              <div className="user-name">{currentUser.name}</div>
              <div className="user-role-tag">{currentUser.role}</div>
            </div>
          </div>
          <button className="btn btn-danger" style={{ marginLeft: 10, padding: '6px 14px', fontSize: 13 }} onClick={doLogout}>Log Out</button>
        </div>
      </nav>

      {/* Toast */}
      <div className="toast-area">
        {toasts.map(t => <div key={t.id} className="toast">{t.msg}</div>)}
      </div>

      {/* Pages */}
      <div className="main-content">
        {page === 'dashboard' && <DashboardPage orders={autoFlaggedOrders} customers={customers} services={services} iceStock={iceStock} cioRecords={cioRecords} expenses={expenses} dashRange={dashRange} setDashRange={setDashRange} peso={peso} curStock={curStock} />}
        {page === 'inventory' && <InventoryPage iceStock={iceStock} vendors={vendors} cioRecords={cioRecords} toolItems={toolItems} brokenIce={brokenIce} brokenForm={brokenForm} setBrokenForm={setBrokenForm} brokenSearch={brokenSearch} setBrokenSearch={setBrokenSearch} orders={orders} curStock={curStock} peso={peso} isAdmin={isAdmin} onStockSettings={openStockSettings} onAddItem={() => openToolModal(null)} onEditTool={id => openToolModal(id)} onDeleteTool={deleteTool} onViewLog={() => setPage('checkinout')} onSubmitBroken={submitBrokenIce} onDeleteBroken={deleteBrokenIce} />}
        {page === 'checkinout' && <StockLogPage cioRecords={cioRecords} cioForm={cioForm} setCioForm={setCioForm} onSubmitCIO={submitCIO} cioSearch={cioSearch} setCioSearch={setCioSearch} cioFilter={cioFilter} setCioFilter={setCioFilter} />}
        {page === 'tools-cio' && <ToolsCIOPage toolItems={toolItems} toolCIORecords={toolCIORecords} tcioForm={tcioForm} setTcioForm={setTcioForm} onSubmit={submitToolCIO} tcioSearch={tcioSearch} setTcioSearch={setTcioSearch} tcioFilter={tcioFilter} setTcioFilter={setTcioFilter} />}
        {page === 'orders' && <OrdersPage orders={autoFlaggedOrders} customers={customers} services={services} isAdmin={isAdmin} peso={peso} orderSearch={orderSearch} setOrderSearch={setOrderSearch} orderFilter={orderFilter} setOrderFilter={setOrderFilter} onNewOrder={openCreateOrder} onViewOrder={viewOrder} onMarkPaid={openMarkPaid} onMarkOverdue={markOverdue} onUpdateDelivery={updateDeliveryStatus} onToggleApproval={toggleApproval} />}
        {page === 'soa' && <SOAPage orders={autoFlaggedOrders} soas={soas} customers={customers} peso={peso} soaCustFilter={soaCustFilter} setSoaCustFilter={setSoaCustFilter} onGenerate={generateSOA} onViewOrder={viewOrder} />}
        {page === 'services' && <ServicesPage services={services} isAdmin={isAdmin} peso={peso} onAdd={() => openServiceModal()} onEdit={openServiceModal} onDelete={deleteService} />}
        {page === 'customers' && <CustomersPage customers={customers} orders={autoFlaggedOrders} isAdmin={isAdmin} peso={peso} custSearch={custSearch} setCustSearch={setCustSearch} reminderDays={reminderDays} setReminderDays={setReminderDays} viewingCustomerId={viewingCustomerId} setViewingCustomerId={setViewingCustomerId} onAdd={() => openCustomerModal()} onEdit={openCustomerModal} onDelete={deleteCustomer} onViewOrders={(cid) => { setOrderSearch(customers.find(c=>c.id===cid)?.name||''); setPage('orders') }} />}
        {page === 'vendors' && <VendorsPage vendors={vendors} isAdmin={isAdmin} vendorSearch={vendorSearch} setVendorSearch={setVendorSearch} onAdd={() => openVendorModal()} onEdit={openVendorModal} onDelete={deleteVendor} />}
        {page === 'users' && <UsersPage appUsers={appUsers} currentUser={currentUser} isAdmin={isAdmin} onAdd={() => openUserModal()} onEdit={openUserModal} onDelete={deleteUser} />}
        {page === 'expenses' && <ExpensesPage expenses={expenses} isAdmin={isAdmin} peso={peso} expenseSearch={expenseSearch} setExpenseSearch={setExpenseSearch} expenseCatFilter={expenseCatFilter} setExpenseCatFilter={setExpenseCatFilter} onAdd={() => openExpenseModal()} onEdit={openExpenseModal} onDelete={deleteExpense} />}
        {page === 'clock' && <ClockPage appUsers={appUsers} clockRecords={clockRecords} currentUser={currentUser} clockForm={clockForm} setClockForm={setClockForm} clockSearch={clockSearch} setClockSearch={setClockSearch} onSubmit={submitClock} onClockOut={clockOut} onDelete={deleteClockRecord} />}
        {page === 'reports' && <ReportsPage orders={autoFlaggedOrders} expenses={expenses} customers={customers} services={services} cioRecords={cioRecords} brokenIce={brokenIce} clockRecords={clockRecords} iceStock={iceStock} peso={peso} />}
        {page === 'superadmin' && <SuperAdminPage featureFlags={featureFlags} setFeatureFlags={setFeatureFlags} appUsers={appUsers} />}
      </div>

      {/* Modals */}
      {modal === 'order' && (
        <Modal onClose={closeModal} maxWidth={620}>
          <div className="modal-title">New Order</div>
          <div className="form-grid">
            <div className="field full">
              <div className="field-label">Customer *</div>
              <select value={orderForm.customerId} onChange={e => setOrderForm(f => ({ ...f, customerId: e.target.value }))} style={{ flex: 1 }}>
                <option value="">— Select customer —</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="field"><div className="field-label">Order Date</div><input type="date" value={orderForm.date} onChange={e => setOrderForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Invoice Date</div><input type="date" value={orderForm.invoiceDate} onChange={e => setOrderForm(f => ({ ...f, invoiceDate: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Due Date</div><input type="date" value={orderForm.dueDate} onChange={e => setOrderForm(f => ({ ...f, dueDate: e.target.value }))} /></div>
            <div className="field"><div className="field-label">DR Number</div><input type="text" value={orderForm.drNumber} placeholder="e.g. DR-001" onChange={e => setOrderForm(f => ({ ...f, drNumber: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Plate Number</div><input type="text" value={orderForm.plateNumber} placeholder="e.g. ABC 123" onChange={e => setOrderForm(f => ({ ...f, plateNumber: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Delivery Status</div>
              <select value={orderForm.deliveryStatus} onChange={e => setOrderForm(f => ({ ...f, deliveryStatus: e.target.value }))}>
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>
          <hr />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
            <div className="field-label">ORDER LINE ITEMS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>Default price/block (₱):</span>
              <input type="number" value={orderForm.defaultPrice} style={{ width: 80, padding: '6px 9px', fontSize: 13 }} step="0.01" onChange={e => {
                const v = e.target.value
                setOrderForm(f => ({ ...f, defaultPrice: v }))
                setOrderLines(prev => prev.map(l => ({ ...l, pricePerBlock: v })))
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>
            {orderLines.map(line => (
              <div key={line.id} style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 14 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: 12 }}>
                  <div className="field" style={{ flex: 1, minWidth: 90 }}>
                    <div className="field-label" style={{ fontSize: 10 }}>BLOCKS *</div>
                    <input type="number" value={line.qty} placeholder="0" min="1" onChange={e => updateLine(line.id, 'qty', e.target.value)} style={{ padding: '9px 10px', fontWeight: 700 }} />
                  </div>
                  <div className="field" style={{ flex: 1, minWidth: 90 }}>
                    <div className="field-label" style={{ fontSize: 10 }}>PRICE / BLOCK (₱)</div>
                    <input type="number" value={line.pricePerBlock} step="0.01" onChange={e => updateLine(line.id, 'pricePerBlock', e.target.value)} style={{ padding: '9px 10px', fontSize: 14 }} />
                  </div>
                  <button onClick={() => removeOrderLine(line.id)} style={{ width: 36, height: 40, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 18, flexShrink: 0 }}>×</button>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div className="field-label" style={{ fontSize: 10, marginBottom: 7 }}>ADD-ON SERVICES</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    {services.length ? services.map(s => {
                      const active = line.selectedSvcIds.includes(s.id)
                      return (
                        <button key={s.id} type="button" onClick={() => toggleAddon(line.id, s.id)}
                          style={{ padding: '6px 11px', borderRadius: 20, border: `1px solid ${active ? 'var(--blue)' : 'var(--border2)'}`, background: active ? 'var(--blue)' : 'transparent', color: active ? '#fff' : 'var(--text2)', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s ease', fontFamily: 'var(--font-body)' }}>
                          {s.name} +{peso(s.price)}
                        </button>
                      )
                    }) : <span style={{ fontSize: 12, color: 'var(--text3)' }}>No services configured</span>}
                  </div>
                </div>
                {(parseInt(line.qty) || 0) > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--text2)', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                    <span>{line.qty}×{peso(line.pricePerBlock)}</span>
                    {line.selectedSvcIds.length > 0 && <span> + services ({peso(line.selectedSvcIds.reduce((s, sid) => { const svc = services.find(sv => sv.id === sid); return s + (svc ? svc.price * parseInt(line.qty) : 0) }, 0))})</span>}
                    &nbsp;=&nbsp;<span style={{ color: 'var(--blue)', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{peso(calcLineTotal(line))}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" style={{ width: '100%', borderStyle: 'dashed' }} onClick={addOrderLine}>+ Add Another Line</button>
          <hr />
          <div className="field"><div className="field-label">Notes</div><textarea value={orderForm.notes} rows={2} style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 13 }} onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional…" /></div>
          {orderLines.some(l => parseInt(l.qty) > 0) && (
            <div className="order-summary-box">
              {orderLines.filter(l => parseInt(l.qty) > 0).map(l => {
                const svcs = l.selectedSvcIds.map(sid => services.find(s => s.id === sid)).filter(Boolean)
                return <div key={l.id} className="order-line"><span>{l.qty} block{parseInt(l.qty) !== 1 ? 's' : ''} — {svcs.length ? svcs.map(s => s.name).join(' + ') : 'No processing'}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{peso(calcLineTotal(l))}</span></div>
              })}
              <div className="order-total-line"><span>Total ({orderTotalBlocks} block{orderTotalBlocks !== 1 ? 's' : ''})</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{peso(orderGrandTotal)}</span></div>
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveOrder}>Create Order & Invoice</button>
          </div>
        </Modal>
      )}

      {modal === 'paid' && (() => {
        const o = orders.find(o => o.id === markingPaidId)
        const c = o ? getCustomer(customers, o.customerId) : {}
        return (
          <Modal onClose={closeModal} maxWidth={460}>
            <div className="modal-title">Mark Invoice Paid</div>
            {o && <div className="paid-summary">
              <div className="paid-row"><span>Invoice</span><span style={{ fontFamily: 'var(--font-mono)' }}>{o.id}</span></div>
              <div className="paid-row"><span>Customer</span><span style={{ fontWeight: 600 }}>{c.name}</span></div>
              <div className="paid-row total"><span>Amount Due</span><span style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{peso(o.total)}</span></div>
            </div>}
            <div className="form-grid">
              <div className="field"><div className="field-label">Payment Method</div>
                <select value={paidForm.method} onChange={e => setPaidForm(f => ({ ...f, method: e.target.value }))}>
                  <option>Cash</option><option>Check</option><option>GCash</option><option>Bank Transfer</option><option>Other</option>
                </select>
              </div>
              <div className="field"><div className="field-label">Payment Date</div><input type="date" value={paidForm.date} onChange={e => setPaidForm(f => ({ ...f, date: e.target.value }))} /></div>
              {paidForm.method === 'Check' && <div className="field"><div className="field-label">Check Number</div><input type="text" value={paidForm.checkNum} onChange={e => setPaidForm(f => ({ ...f, checkNum: e.target.value }))} /></div>}
              <div className="field"><div className="field-label">Amount Received (₱)</div><input type="number" value={paidForm.amount} step="0.01" onChange={e => setPaidForm(f => ({ ...f, amount: e.target.value }))} /></div>
              <div className="field full"><div className="field-label">Received By</div><input type="text" value={paidForm.staff} onChange={e => setPaidForm(f => ({ ...f, staff: e.target.value }))} /></div>
              <div className="field full"><div className="field-label">Notes / Reference</div><input type="text" value={paidForm.notes} onChange={e => setPaidForm(f => ({ ...f, notes: e.target.value }))} /></div>
              <div className="field full">
                <div className="field-label">Payment Photo (optional)</div>
                <div className="photo-upload">
                  <input type="file" accept="image/*" capture="environment" onChange={e => {
                    const file = e.target.files[0]; if (!file) return
                    const reader = new FileReader()
                    reader.onload = ev => setPhotoDataUrl(ev.target.result)
                    reader.readAsDataURL(file)
                  }} />
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>{photoDataUrl ? 'Photo attached — tap to change' : 'Tap to take photo or upload image'}</div>
                  {photoDataUrl && <img src={photoDataUrl} style={{ width: '100%', maxHeight: 160, objectFit: 'contain', borderRadius: 'var(--radius-sm)', marginTop: 10 }} />}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-success" onClick={confirmMarkPaid}>Confirm Payment</button>
            </div>
          </Modal>
        )
      })()}

      {modal === 'invoiceView' && (() => {
        const o = orders.find(o => o.id === viewingOrderId)
        return (
          <Modal onClose={closeModal} maxWidth={460} transparent>
            <div className="receipt" dangerouslySetInnerHTML={{ __html: buildInvoiceHTML(o) }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-ghost" onClick={closeModal}>Close</button>
              <button className="btn btn-primary" onClick={() => window.print()}>Print</button>
              {isAdmin && o && o.status !== 'Cancelled' && o.status !== 'Paid' && (
                <button className="btn btn-danger btn-sm" onClick={cancelCurrentOrder}>Cancel Order</button>
              )}
            </div>
          </Modal>
        )
      })()}

      {modal === 'service' && (
        <Modal onClose={closeModal} maxWidth={420}>
          <div className="modal-title">{editServiceId ? 'Edit Service' : 'Add Service'}</div>
          <div className="form-grid">
            <div className="field full"><div className="field-label">Service Name *</div><input type="text" value={serviceForm.name} onChange={e => setServiceForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Crushing, Cubing…" /></div>
            <div className="field"><div className="field-label">Price (₱)</div><input type="number" value={serviceForm.price} step="0.01" onChange={e => setServiceForm(f => ({ ...f, price: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Unit</div><input type="text" value={serviceForm.unit} onChange={e => setServiceForm(f => ({ ...f, unit: e.target.value }))} placeholder="e.g. per block, flat fee…" /></div>
            <div className="field full"><div className="field-label">Description</div><input type="text" value={serviceForm.desc} onChange={e => setServiceForm(f => ({ ...f, desc: e.target.value }))} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveService}>Save Service</button>
          </div>
        </Modal>
      )}

      {modal === 'customer' && (
        <Modal onClose={closeModal} maxWidth={500}>
          <div className="modal-title">{editCustomerId ? 'Edit Customer' : 'Add Customer'}</div>
          <div className="form-grid">
            <div className="field full"><div className="field-label">Customer Name *</div><input type="text" value={customerForm.name} onChange={e => setCustomerForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Contact Person</div><input type="text" value={customerForm.contact} onChange={e => setCustomerForm(f => ({ ...f, contact: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Phone</div><input type="tel" value={customerForm.phone} onChange={e => setCustomerForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Email</div><input type="email" value={customerForm.email} onChange={e => setCustomerForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="field full"><div className="field-label">Area / Address</div><input type="text" value={customerForm.area} onChange={e => setCustomerForm(f => ({ ...f, area: e.target.value }))} /></div>
            <div className="field full"><div className="field-label">Notes</div><textarea value={customerForm.notes} rows={2} style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 13 }} onChange={e => setCustomerForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <hr style={{ margin: '14px 0 10px' }} />
          <div style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 600, letterSpacing: '.06em', marginBottom: 10 }}>NUMBERING SETTINGS</div>
          <div className="form-grid">
            <div className="field"><div className="field-label">SOA Start #</div><input type="number" min="1" value={customerForm.soaStartNum} onChange={e => setCustomerForm(f => ({ ...f, soaStartNum: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Invoice Start #</div><input type="number" min="1" value={customerForm.invoiceStartNum} onChange={e => setCustomerForm(f => ({ ...f, invoiceStartNum: e.target.value }))} /></div>
            <div className="field"><div className="field-label">OLC Start #</div><input type="number" min="1" value={customerForm.olcStartNum} onChange={e => setCustomerForm(f => ({ ...f, olcStartNum: e.target.value }))} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveCustomer}>Save Customer</button>
          </div>
        </Modal>
      )}

      {modal === 'vendor' && (
        <Modal onClose={closeModal}>
          <div className="modal-title">{editVendorId ? 'Edit Vendor' : 'Add Vendor'}</div>
          <div className="form-grid">
            <div className="field full"><div className="field-label">Company Name *</div><input type="text" value={vendorForm.name} onChange={e => setVendorForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Contact Name</div><input type="text" value={vendorForm.contact} onChange={e => setVendorForm(f => ({ ...f, contact: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Phone</div><input type="tel" value={vendorForm.phone} onChange={e => setVendorForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Email</div><input type="email" value={vendorForm.email} onChange={e => setVendorForm(f => ({ ...f, email: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Payment Terms</div>
              <select value={vendorForm.terms} onChange={e => setVendorForm(f => ({ ...f, terms: e.target.value }))}>
                <option>Due on Receipt</option><option>Net 7</option><option>Net 15</option><option>Net 30</option><option>COD</option>
              </select>
            </div>
            <div className="field"><div className="field-label">City / Area</div><input type="text" value={vendorForm.city} onChange={e => setVendorForm(f => ({ ...f, city: e.target.value }))} /></div>
            <div className="field full"><div className="field-label">Notes</div><textarea value={vendorForm.notes} rows={2} style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 13 }} onChange={e => setVendorForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveVendor}>Save</button>
          </div>
        </Modal>
      )}

      {modal === 'route' && (
        <Modal onClose={closeModal} maxWidth={460}>
          <div className="modal-title">{editRouteId ? 'Edit Route' : 'Add Route'}</div>
          <div className="form-grid">
            <div className="field full"><div className="field-label">Route Name *</div><input type="text" value={routeForm.name} onChange={e => setRouteForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Driver</div><input type="text" value={routeForm.driver} onChange={e => setRouteForm(f => ({ ...f, driver: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Vehicle</div><input type="text" value={routeForm.vehicle} onChange={e => setRouteForm(f => ({ ...f, vehicle: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Status</div>
              <select value={routeForm.status} onChange={e => setRouteForm(f => ({ ...f, status: e.target.value }))}>
                <option>Active</option><option>On Route</option><option>Completed</option><option>Inactive</option>
              </select>
            </div>
            <div className="field full"><div className="field-label">Stops</div><textarea value={routeForm.stops} rows={2} style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: 13 }} onChange={e => setRouteForm(f => ({ ...f, stops: e.target.value }))} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveRoute}>Save Route</button>
          </div>
        </Modal>
      )}

      {modal === 'user' && (
        <Modal onClose={closeModal} maxWidth={420}>
          <div className="modal-title">{editUserId ? 'Edit User' : 'Add User'}</div>
          <div className="form-grid">
            <div className="field full"><div className="field-label">Full Name *</div><input type="text" value={userForm.name} onChange={e => setUserForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Username *</div><input type="text" value={userForm.username} onChange={e => setUserForm(f => ({ ...f, username: e.target.value }))} autoComplete="off" /></div>
            <div className="field"><div className="field-label">Password {editUserId ? '(leave blank to keep)' : '*'}</div><input type="password" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} autoComplete="new-password" /></div>
            <div className="field full"><div className="field-label">Role</div>
              <select value={userForm.role} onChange={e => setUserForm(f => ({ ...f, role: e.target.value }))}>
                <option value="admin">Admin</option>
                <option value="assistant">Assistant</option>
                <option value="operator">Production Operator</option>
                <option value="staff">Staff (Clock only)</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveUser}>{editUserId ? 'Save Changes' : 'Add User'}</button>
          </div>
        </Modal>
      )}

      {modal === 'tool' && (
        <Modal onClose={closeModal} maxWidth={440}>
          <div className="modal-title">{editToolId ? 'Edit Item' : 'Add Item'}</div>
          <div className="form-grid">
            <div className="field full"><div className="field-label">Item Name *</div><input type="text" value={toolForm.name} onChange={e => setToolForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ice Pick, Ice Tongs…" /></div>
            <div className="field"><div className="field-label">Category</div>
              <select value={toolForm.category} onChange={e => setToolForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">— Select category —</option>
                <option>Hand Tool</option>
                <option>Cutting Tool</option>
                <option>Machine</option>
                <option>Production</option>
                <option>Safety Equipment</option>
                <option>Refrigeration</option>
                <option>Other</option>
              </select>
            </div>
            <div className="field"><div className="field-label">Quantity</div><input type="number" value={toolForm.qty} min="0" onChange={e => setToolForm(f => ({ ...f, qty: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Condition</div>
              <select value={toolForm.condition} onChange={e => setToolForm(f => ({ ...f, condition: e.target.value }))}>
                <option>Good</option><option>Fair</option><option>Poor</option>
              </select>
            </div>
            <div className="field full"><div className="field-label">Notes</div><input type="text" value={toolForm.notes} onChange={e => setToolForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes…" /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveTool}>Save Item</button>
          </div>
        </Modal>
      )}

      {modal === 'expense' && (
        <Modal onClose={closeModal} maxWidth={500}>
          <div className="modal-title">{editExpenseId ? 'Edit Expense' : 'Add Expense'}</div>
          <div className="form-grid">
            <div className="field"><div className="field-label">Date *</div><input type="date" value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Category</div>
              <select value={expenseForm.category} onChange={e => setExpenseForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">— Select —</option>
                {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field full"><div className="field-label">Vendor / Payee *</div><input type="text" value={expenseForm.vendor} onChange={e => setExpenseForm(f => ({ ...f, vendor: e.target.value }))} placeholder="e.g. Meralco, Shell, Hardware store…" /></div>
            <div className="field full"><div className="field-label">Description</div><input type="text" value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))} placeholder="What was purchased/paid for?" /></div>
            <div className="field"><div className="field-label">Amount (₱) *</div><input type="number" value={expenseForm.amount} step="0.01" min="0" onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} /></div>
            <div className="field"><div className="field-label">Payment Method</div>
              <select value={expenseForm.method} onChange={e => setExpenseForm(f => ({ ...f, method: e.target.value }))}>
                <option>Cash</option><option>GCash</option><option>Bank Transfer</option><option>Check</option><option>Other</option>
              </select>
            </div>
            <div className="field"><div className="field-label">Reference #</div><input type="text" value={expenseForm.ref} onChange={e => setExpenseForm(f => ({ ...f, ref: e.target.value }))} placeholder="Receipt / OR #" /></div>
            <div className="field"><div className="field-label">Notes</div><input type="text" value={expenseForm.notes} onChange={e => setExpenseForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveExpense}>{editExpenseId ? 'Save Changes' : 'Record Expense'}</button>
          </div>
        </Modal>
      )}

      {modal === 'stockSettings' && (
        <Modal onClose={closeModal} maxWidth={380}>
          <div className="modal-title">Stock Settings</div>
          <div className="field" style={{ marginBottom: 12 }}><div className="field-label">Cost Per Block (₱)</div><input type="number" value={stockForm.costPerBlock} step="0.01" onChange={e => setStockForm(f => ({ ...f, costPerBlock: e.target.value }))} /></div>
          <div className="field" style={{ marginBottom: 12 }}><div className="field-label">Low Stock Threshold</div><input type="number" value={stockForm.threshold} min="0" onChange={e => setStockForm(f => ({ ...f, threshold: e.target.value }))} /></div>
          <div className="field" style={{ marginBottom: 16 }}><div className="field-label">Supplier Vendor</div>
            <select value={stockForm.vendor} onChange={e => setStockForm(f => ({ ...f, vendor: e.target.value }))}>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
            <button className="btn btn-primary" onClick={saveStockSettings}>Save</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

// ── MODAL WRAPPER ──
function Modal({ children, onClose, maxWidth = 600, transparent = false }) {
  return (
    <div className="modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal" style={{ maxWidth, ...(transparent ? { background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 } : {}) }}>
        <div className="modal-handle" />
        {children}
      </div>
    </div>
  )
}

// ── LOGIN ──
function LoginScreen({ loginUser, setLoginUser, loginPass, setLoginPass, loginError, onLogin, onFill }) {
  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <img src="/logo.png.png" alt="OLC Ice Plant" style={{ height: 90, objectFit: 'contain' }} />
        </div>
        <div className="login-tagline">Ice Inventory · Philippines</div>
        {loginError && <div className="login-error">Incorrect username or password.</div>}
        <label className="lbl">Username</label>
        <input className="login-input" type="text" placeholder="Enter username" value={loginUser} onChange={e => setLoginUser(e.target.value)} onKeyDown={e => e.key === 'Enter' && onLogin()} autoComplete="username" />
        <label className="lbl">Password</label>
        <input className="login-input" type="password" placeholder="Enter password" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && onLogin()} autoComplete="current-password" />
        <button className="login-btn" onClick={onLogin}>Sign In</button>
        <div className="demo-section">
          <div className="demo-label">Demo Accounts</div>
          <div className="demo-chips">
            <div className="demo-chip" onClick={() => onFill('admin', 'admin123')}><div className="demo-chip-role">Admin</div><div className="demo-chip-creds">admin / admin123</div></div>
            <div className="demo-chip" onClick={() => onFill('assistant', 'asst123')}><div className="demo-chip-role">Assistant</div><div className="demo-chip-creds">assistant / asst123</div></div>
            <div className="demo-chip" onClick={() => onFill('operator', 'op123')}><div className="demo-chip-role">Operator</div><div className="demo-chip-creds">operator / op123</div></div>
            <div className="demo-chip" onClick={() => onFill('staff', 'staff123')}><div className="demo-chip-role">Staff</div><div className="demo-chip-creds">staff / staff123</div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── DASHBOARD ──
function DashboardPage({ orders, customers, services, iceStock, cioRecords, expenses, dashRange, setDashRange, peso, curStock }) {
  const revChartRef = useRef(null)
  const catChartRef = useRef(null)
  const revInstance = useRef(null)
  const catInstance = useRef(null)

  const since = Date.now() - dashRange * 86400000
  // Production capacity
  const todayStr = new Date().toDateString()
  const todayProduced = cioRecords.filter(r => (r.type === 'in') && new Date(r.date).toDateString() === todayStr).reduce((s, r) => s + r.qty, 0)
  const capacityPct = Math.min(100, Math.round((todayProduced / DAILY_CAPACITY) * 100))
  const periodProduced = cioRecords.filter(r => r.type === 'in' && new Date(r.date).getTime() > since).reduce((s, r) => s + r.qty, 0)
  const totalExpenses = expenses.filter(e => new Date(e.date).getTime() > since).reduce((s, e) => s + e.amount, 0)
  const paid = orders.filter(o => o.status === 'Paid' && new Date(o.date).getTime() > since)
  const rev = paid.reduce((s, o) => s + o.total, 0)
  const cost = paid.reduce((s, o) => s + o.blocks * iceStock.costPerBlock, 0)
  const profit = rev - cost
  const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0.0'
  const totalBlocks = paid.reduce((s, o) => s + o.blocks, 0)
  const unpaid = orders.filter(o => o.status === 'Unpaid' || o.status === 'Overdue').reduce((s, o) => s + o.total, 0)
  const arPaid = orders.filter(o => o.status === 'Paid').reduce((s, o) => s + o.total, 0)
  const arUnpaid = orders.filter(o => o.status === 'Unpaid').reduce((s, o) => s + o.total, 0)
  const arOverdue = orders.filter(o => o.status === 'Overdue').reduce((s, o) => s + o.total, 0)
  const arTotal = arPaid + arUnpaid + arOverdue || 1

  const getCustomerName = (id) => { const c = customers.find(c => c.id === id); return c ? c.name : 'Unknown' }
  const getService = (id) => services.find(s => s.id === id) || { name: '?', price: 0 }

  useEffect(() => {
    if (!revChartRef.current || !catChartRef.current) return
    if (revInstance.current) { revInstance.current.destroy(); revInstance.current = null }
    if (catInstance.current) { catInstance.current.destroy(); catInstance.current = null }

    const labels = [], vals = [], cVals = []
    for (let i = dashRange - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      labels.push(dashRange <= 7 ? d.toLocaleDateString('en', { weekday: 'short' }) : d.toLocaleDateString('en', { month: 'short', day: 'numeric' }))
      const dO = orders.filter(o => o.status === 'Paid' && new Date(o.date).toDateString() === d.toDateString())
      vals.push(dO.reduce((s, o) => s + o.total, 0))
      cVals.push(dO.reduce((s, o) => s + o.blocks * iceStock.costPerBlock, 0))
    }
    const step = Math.max(1, Math.floor(dashRange / 10))
    const fL = labels.filter((_, i) => i % step === 0), fV = vals.filter((_, i) => i % step === 0), fC = cVals.filter((_, i) => i % step === 0)
    const ac = '#0ea5e9', tc = '#8bb8d4', bc = 'rgba(14,165,233,0.1)'
    revInstance.current = new Chart(revChartRef.current, {
      type: 'line', data: { labels: fL, datasets: [{ label: 'Revenue', data: fV, borderColor: ac, backgroundColor: 'rgba(14,165,233,0.08)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 2 }, { label: 'Cost', data: fC, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.05)', fill: true, tension: 0.4, pointRadius: 2, borderWidth: 1.5, borderDash: [4, 4] }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: tc, font: { size: 11 } } } }, scales: { x: { ticks: { color: tc, font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: bc } }, y: { ticks: { color: tc, font: { size: 10 }, callback: v => '₱' + v }, grid: { color: bc } } } }
    })

    const svcRevMap = {}
    paid.forEach(o => {
      const blkRev = o.blocks * (o.pricePerBlock || 0)
      svcRevMap['Ice Blocks'] = (svcRevMap['Ice Blocks'] || 0) + blkRev;
      (o.lines || []).forEach(l => { (l.serviceIds || []).forEach(sid => { const svc = getService(sid); svcRevMap[svc.name] = (svcRevMap[svc.name] || 0) + svc.price * l.qty }) })
      ;(o.services || []).forEach(sv => { const svc = getService(sv.serviceId); svcRevMap[svc.name] = (svcRevMap[svc.name] || 0) + svc.price * (sv.qty || 1) })
    })
    const cColors = ['#0ea5e9', '#22c55e', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899']
    if (Object.keys(svcRevMap).length > 0) {
      catInstance.current = new Chart(catChartRef.current, {
        type: 'doughnut', data: { labels: Object.keys(svcRevMap), datasets: [{ data: Object.values(svcRevMap), backgroundColor: cColors.slice(0, Object.keys(svcRevMap).length), borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: tc, font: { size: 11 }, padding: 10 } } } }
      })
    }
    return () => { revInstance.current?.destroy(); catInstance.current?.destroy() }
  }, [dashRange, orders, iceStock])

  const custMap = {}
  paid.forEach(o => { const name = getCustomerName(o.customerId); custMap[name] = (custMap[name] || 0) + o.total })
  const sortedC = Object.entries(custMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const mx = sortedC[0]?.[1] || 1

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Dashboard</div><div className="section-sub">Operations overview</div></div>
        <select value={dashRange} onChange={e => setDashRange(parseInt(e.target.value))} style={{ width: 'auto' }}>
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
        </select>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-val green">{peso(rev)}</div><div className="stat-trend">Last {dashRange} days (paid)</div></div>
        <div className="stat-card"><div className="stat-label">Gross Profit</div><div className="stat-val accent">{peso(profit)}</div></div>
        <div className="stat-card"><div className="stat-label">Expenses</div><div className="stat-val danger">{peso(totalExpenses)}</div><div className="stat-trend">Last {dashRange} days</div></div>
        <div className="stat-card"><div className="stat-label">Margin</div><div className={`stat-val ${parseFloat(margin) > 40 ? 'green' : parseFloat(margin) > 20 ? 'warn' : 'danger'}`}>{margin}%</div></div>
        <div className="stat-card"><div className="stat-label">Blocks Sold</div><div className="stat-val">{totalBlocks}</div></div>
        <div className="stat-card"><div className="stat-label">Outstanding AR</div><div className="stat-val warn">{peso(unpaid)}</div></div>
        <div className="stat-card"><div className="stat-label">Stock (blocks)</div><div className={`stat-val ${curStock <= iceStock.threshold ? 'danger' : 'accent'}`}>{curStock}</div></div>
        <div className="stat-card">
          <div className="stat-label">Today's Production</div>
          <div className={`stat-val ${capacityPct >= 80 ? 'green' : capacityPct >= 50 ? 'warn' : 'danger'}`}>{todayProduced} <span style={{ fontSize: 13, fontWeight: 400 }}>/ {DAILY_CAPACITY}</span></div>
          <div style={{ marginTop: 6, height: 5, background: 'var(--dark3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: capacityPct + '%', background: capacityPct >= 80 ? '#22c55e' : capacityPct >= 50 ? '#f59e0b' : '#ef4444', borderRadius: 3, transition: 'width .4s' }} />
          </div>
          <div className="stat-trend">{capacityPct}% of daily capacity</div>
        </div>
      </div>
      <div className="dash-grid wide">
        <div className="chart-card"><div className="chart-title">Revenue vs Cost <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 400 }}>{peso(rev)} total</span></div><div className="chart-wrap"><canvas ref={revChartRef} /></div></div>
        <div className="chart-card"><div className="chart-title">Revenue by Service</div><div className="chart-wrap"><canvas ref={catChartRef} /></div></div>
      </div>
      <div className="dash-grid">
        <div className="chart-card">
          <div className="chart-title">Top Customers</div>
          {sortedC.length ? sortedC.map(([n, v], i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text3)', width: 20 }}>#{i + 1}</div>
              <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{n}</div>
              <div style={{ width: 70, height: 6, background: 'var(--dark3)', borderRadius: 3, overflow: 'hidden' }}><div style={{ height: '100%', width: `${(v / mx * 100).toFixed(0)}%`, background: 'linear-gradient(90deg,var(--blue),var(--blue2))', borderRadius: 3 }} /></div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--blue)', minWidth: 60, textAlign: 'right' }}>{peso(v)}</div>
            </div>
          )) : <div style={{ color: 'var(--text3)', fontSize: 13, padding: 20, textAlign: 'center' }}>No paid orders yet</div>}
        </div>
        <div className="chart-card">
          <div className="chart-title">Receivables (AR)</div>
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', margin: '0 0 12px', gap: 2 }}>
            <div style={{ width: `${(arPaid / arTotal * 100).toFixed(0)}%`, background: '#22c55e', borderRadius: 2 }} />
            <div style={{ width: `${(arUnpaid / arTotal * 100).toFixed(0)}%`, background: '#0ea5e9', borderRadius: 2 }} />
            <div style={{ width: `${(arOverdue / arTotal * 100).toFixed(0)}%`, background: '#ef4444', borderRadius: 2 }} />
          </div>
          {[['Paid', arPaid, '#22c55e', 'rgba(34,197,94,0.08)', 'rgba(34,197,94,0.2)'], ['Unpaid', arUnpaid, 'var(--blue)', 'rgba(14,165,233,0.08)', 'rgba(14,165,233,0.2)'], ['Overdue', arOverdue, '#ef4444', 'rgba(239,68,68,0.08)', 'rgba(239,68,68,0.2)']].map(([label, val, col, bg, border]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: bg, border: `1px solid ${border}`, borderRadius: 'var(--radius-sm)', marginBottom: 7 }}>
              <span style={{ fontSize: 13, color: col, fontWeight: 600 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: col }}>{peso(val)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 12px', background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>Total AR Outstanding</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>{peso(arUnpaid + arOverdue)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── INVENTORY ──
function InventoryPage({ iceStock, vendors, cioRecords, toolItems, brokenIce, brokenForm, setBrokenForm, brokenSearch, setBrokenSearch, curStock, peso, isAdmin, onStockSettings, onAddItem, onEditTool, onDeleteTool, onViewLog, onSubmitBroken, onDeleteBroken }) {
  const pct = Math.min(100, (curStock / Math.max(iceStock.threshold * 3, 1)) * 100)
  const isLow = curStock <= iceStock.threshold, isOut = curStock <= 0
  const fillColor = isOut ? '#ef4444' : isLow ? '#f59e0b' : '#22c55e'
  const vend = vendors.find(v => v.id === iceStock.vendor)
  const totalProduced = cioRecords.filter(r => r.type === 'in' || r.type === 'restore').reduce((s, r) => s + r.qty, 0)
  const totalSold = cioRecords.filter(r => r.type === 'out').reduce((s, r) => s + r.qty, 0)
  const stockVal = curStock * iceStock.costPerBlock
  const RLABEL = { in: 'Production', out: 'Order Sale', restore: 'Restored' }
  const RBADGE = { in: 'badge-green', out: 'badge-blue', restore: 'badge-warn' }
  const recent = [...cioRecords].reverse().slice(0, 10)

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Inventory</div><div className="section-sub">Ice blocks &amp; tools management</div></div>
        <button className="btn btn-primary" onClick={onAddItem}>+ Add Item</button>
      </div>

      <div className="ice-hero">
        <div>
          <div className="ice-count">{curStock}</div>
          <div className="ice-unit">blocks in stock</div>
        </div>
        <div className="ice-meta">
          <div className="ice-name">Ice Blocks</div>
          <div className="ice-detail">Cost per block: {peso(iceStock.costPerBlock)}</div>
          <div className="ice-detail">Low stock threshold: {iceStock.threshold} blocks</div>
          <div className="ice-detail">Supplier: {vend ? vend.name : '—'}</div>
          <div className="ice-threshold">
            <div className="progress-bar"><div className="progress-fill" style={{ width: pct.toFixed(0) + '%', background: fillColor }} /></div>
            <span style={{ fontSize: 11, color: fillColor, fontWeight: 600 }}>{isOut ? 'OUT OF STOCK' : isLow ? 'LOW STOCK' : 'OK'}</span>
          </div>
          <div className="ice-actions">
            <button className="btn btn-ghost btn-sm" onClick={onStockSettings}>Settings</button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">In Stock</div><div className="stat-val accent">{curStock}</div></div>
        <div className="stat-card"><div className="stat-label">Produced</div><div className="stat-val">{totalProduced}</div></div>
        <div className="stat-card"><div className="stat-label">Sold / Used</div><div className="stat-val">{totalSold}</div></div>
        <div className="stat-card"><div className="stat-label">Stock Value</div><div className="stat-val green">{peso(stockVal)}</div></div>
      </div>

      {(isOut || isLow) && (
        <div className="alert-strip">! {isOut ? 'OUT OF STOCK — restock immediately!' : `Low stock: only ${curStock} blocks remaining (threshold: ${iceStock.threshold})`}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Recent Stock Movements</div>
        <button className="btn btn-ghost btn-sm" onClick={onViewLog}>View Full Log</button>
      </div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Date &amp; Time</th><th>Type</th><th>Blocks</th><th>Staff / Source</th><th>Notes</th></tr></thead>
        <tbody>
          {recent.length ? recent.map(r => {
            const d = new Date(r.date)
            const isIn = r.type === 'in' || r.type === 'restore'
            return (
              <tr key={r.id}>
                <td className="td-mono">{d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} {d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</td>
                <td><span className={`badge ${RBADGE[r.type] || 'badge-gray'}`}>{RLABEL[r.type] || r.type}</span></td>
                <td className="td-mono" style={{ color: isIn ? '#22c55e' : '#0ea5e9', fontWeight: 600 }}>{isIn ? '+' : '-'}{r.qty}</td>
                <td style={{ fontSize: 12, color: 'var(--text2)' }}>{r.staff || '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--text3)' }}>{r.ref || '—'}</td>
              </tr>
            )
          }) : <tr><td colSpan={5}><div className="empty-state"><div className="empty-title">No movements yet</div></div></td></tr>}
        </tbody>
      </table></div></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Tools &amp; Equipment</div>
      </div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Name</th><th>Category</th><th>Qty</th><th>Condition</th><th>Notes</th><th>Actions</th></tr></thead>
        <tbody>
          {toolItems.length ? toolItems.map(t => (
            <tr key={t.id}>
              <td className="td-name">{t.name}</td>
              <td><span className="badge badge-blue">{t.category || '—'}</span></td>
              <td className="td-mono" style={{ fontWeight: 700 }}>{t.qty}</td>
              <td><span className={`badge ${t.condition === 'Good' ? 'badge-green' : t.condition === 'Fair' ? 'badge-warn' : 'badge-red'}`}>{t.condition || '—'}</span></td>
              <td style={{ fontSize: 12, color: 'var(--text3)' }}>{t.notes || '—'}</td>
              <td><div className="td-actions"><button className="btn-icon" onClick={() => onEditTool(t.id)}>Edit</button><button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => onDeleteTool(t.id)}>Del</button></div></td>
            </tr>
          )) : <tr><td colSpan={6}><div className="empty-state"><div className="empty-title">No tools added yet</div><div className="empty-sub">Click "+ Add Item" to add tools or equipment</div></div></td></tr>}
        </tbody>
      </table></div></div>

      {/* Broken / Crushed Ice */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0 10px', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Crushed / Reclaimed Ice</div>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>Tracked separately — does not affect block inventory</div>
        </div>
      </div>
      <div className="cio-panel" style={{ marginBottom: 16 }}>
        <div className="cio-title">Log Crushed Ice</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 1fr', gap: 12, marginBottom: 12 }}>
          <div className="field"><div className="field-label">Weight *</div><input type="number" value={brokenForm.weight} placeholder="0" min="0" step="0.1" onChange={e => setBrokenForm(f => ({ ...f, weight: e.target.value }))} /></div>
          <div className="field"><div className="field-label">Unit</div>
            <select value={brokenForm.unit} onChange={e => setBrokenForm(f => ({ ...f, unit: e.target.value }))}>
              <option value="kg">kg</option><option value="lbs">lbs</option>
            </select>
          </div>
          <div className="field"><div className="field-label">Notes</div><input type="text" value={brokenForm.notes} placeholder="Optional…" onChange={e => setBrokenForm(f => ({ ...f, notes: e.target.value }))} /></div>
        </div>
        {brokenForm.weight > 0 && (
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>
            Block equivalent: ≈ <strong style={{ color: 'var(--blue)' }}>{Math.round(parseFloat(brokenForm.weight) / (brokenForm.unit === 'kg' ? 1.45 : 3.2))}</strong> blocks
          </div>
        )}
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onSubmitBroken}>+ Log Crushed Ice</button>
      </div>
      {(() => {
        const totalWeight = brokenIce.reduce((s, r) => s + r.weight, 0)
        const totalBlkEq = brokenIce.reduce((s, r) => s + r.blockEquivalent, 0)
        const q = brokenSearch.toLowerCase()
        const filtered = [...brokenIce].reverse().filter(r => !q || (r.notes || '').toLowerCase().includes(q) || r.enteredBy.toLowerCase().includes(q))
        return (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div className="stat-card" style={{ flex: 1 }}><div className="stat-label">Total Weight Logged</div><div className="stat-val accent">{totalWeight.toFixed(1)} kg</div></div>
              <div className="stat-card" style={{ flex: 1 }}><div className="stat-label">Block Equivalent</div><div className="stat-val">{totalBlkEq} blocks</div></div>
            </div>
            <div className="toolbar" style={{ marginBottom: 10 }}>
              <div className="search-box">{SEARCH_ICON}<input type="text" value={brokenSearch} placeholder="Search…" onChange={e => setBrokenSearch(e.target.value)} /></div>
            </div>
            <div className="table-card"><div className="table-scroll"><table>
              <thead><tr><th>Date</th><th>Weight</th><th>Block Equiv.</th><th>Entered By</th><th>Notes</th>{isAdmin && <th></th>}</tr></thead>
              <tbody>
                {filtered.length ? filtered.map(r => (
                  <tr key={r.id}>
                    <td className="td-mono" style={{ fontSize: 12 }}>{new Date(r.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="td-mono">{r.weight} {r.unit}</td>
                    <td className="td-mono" style={{ color: 'var(--blue)', fontWeight: 600 }}>≈ {r.blockEquivalent}</td>
                    <td style={{ fontSize: 12 }}>{r.enteredBy}</td>
                    <td style={{ fontSize: 12, color: 'var(--text3)' }}>{r.notes || '—'}</td>
                    {isAdmin && <td><button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => onDeleteBroken(r.id)}>Del</button></td>}
                  </tr>
                )) : <tr><td colSpan={isAdmin ? 6 : 5}><div className="empty-state"><div className="empty-title">No entries yet</div></div></td></tr>}
              </tbody>
            </table></div></div>
          </>
        )
      })()}
    </div>
  )
}

// ── STOCK LOG ──
function StockLogPage({ cioRecords, cioForm, setCioForm, onSubmitCIO, cioSearch, setCioSearch, cioFilter, setCioFilter }) {
  const TYPE_LABEL = { in: 'Production', out: 'Order Sale', restore: 'Restored' }
  const TYPE_BADGE = { in: 'badge-green', out: 'badge-blue', restore: 'badge-warn' }
  const q = cioSearch.toLowerCase()
  const recs = [...cioRecords].reverse().filter(r => {
    const mq = !q || (r.ref || '').toLowerCase().includes(q) || (r.staff || '').toLowerCase().includes(q)
    const mf = cioFilter === 'All' || r.type === cioFilter
    return mq && mf
  })
  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Stock Log</div><div className="section-sub">Add produced blocks &amp; view full stock history</div></div>
      </div>
      <div className="cio-panel" style={{ marginBottom: 20 }}>
        <div className="cio-title">Add Produced Blocks</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="field"><div className="field-label">Quantity Produced *</div><input type="number" value={cioForm.qty} placeholder="0" min="1" onChange={e => setCioForm(f => ({ ...f, qty: e.target.value }))} style={{ fontWeight: 700, padding: 12 }} /></div>
          <div className="field"><div className="field-label">Staff / Operator</div><input type="text" value={cioForm.staff} placeholder="Who produced these?" onChange={e => setCioForm(f => ({ ...f, staff: e.target.value }))} /></div>
        </div>
        <div className="field" style={{ marginBottom: 16 }}><div className="field-label">Notes (optional)</div><input type="text" value={cioForm.ref} placeholder="e.g. Morning production run, Machine 2…" onChange={e => setCioForm(f => ({ ...f, ref: e.target.value }))} /></div>
        <button className="btn btn-success" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={onSubmitCIO}>+ Add to Stock</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Stock History</div>
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ minWidth: 120, flex: 1, maxWidth: 240 }}>
            {SEARCH_ICON}
            <input type="text" value={cioSearch} placeholder="Search…" onChange={e => setCioSearch(e.target.value)} />
          </div>
          <select value={cioFilter} onChange={e => setCioFilter(e.target.value)} style={{ minWidth: 100, width: 'auto' }}>
            <option value="All">All</option><option value="in">Production</option><option value="out">Orders</option><option value="restore">Restored</option>
          </select>
        </div>
      </div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Date &amp; Time</th><th>Type</th><th>Blocks</th><th>Staff / Source</th><th>Notes</th></tr></thead>
        <tbody>
          {recs.length ? recs.map(r => {
            const d = new Date(r.date), isIn = r.type === 'in' || r.type === 'restore'
            return (
              <tr key={r.id}>
                <td className="td-mono">{d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} {d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</td>
                <td><span className={`badge ${TYPE_BADGE[r.type] || 'badge-gray'}`}>{TYPE_LABEL[r.type] || r.type}</span></td>
                <td className="td-mono" style={{ color: isIn ? '#22c55e' : '#0ea5e9', fontWeight: 600 }}>{isIn ? '+' : '-'}{r.qty}</td>
                <td style={{ fontSize: 13, color: 'var(--text2)' }}>{r.staff || '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--text3)' }}>{r.ref || '—'}</td>
              </tr>
            )
          }) : <tr><td colSpan={5}><div className="empty-state"><div className="empty-title">No stock entries yet</div><div className="empty-sub">Add blocks above when production runs</div></div></td></tr>}
        </tbody>
      </table></div></div>
    </div>
  )
}

// ── TOOLS CIO ──
function ToolsCIOPage({ toolItems, toolCIORecords, tcioForm, setTcioForm, onSubmit, tcioSearch, setTcioSearch, tcioFilter, setTcioFilter }) {
  const q = tcioSearch.toLowerCase()
  const recs = [...toolCIORecords].reverse().filter(r => {
    const tool = toolItems.find(t => t.id === r.toolId)
    const mq = !q || (tool?.name || '').toLowerCase().includes(q) || (r.staff || '').toLowerCase().includes(q) || (r.notes || '').toLowerCase().includes(q)
    const mf = tcioFilter === 'All' || r.type === tcioFilter
    return mq && mf
  })
  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Check-In / Check-Out</div><div className="section-sub">Track tool usage and availability</div></div>
      </div>
      <div className="cio-panel" style={{ marginBottom: 20 }}>
        <div className="cio-title">Log Tool Check-In / Check-Out</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="field"><div className="field-label">Type *</div>
            <select value={tcioForm.type} onChange={e => setTcioForm(f => ({ ...f, type: e.target.value }))}>
              <option value="checkout">Check-Out</option><option value="checkin">Check-In</option>
            </select>
          </div>
          <div className="field"><div className="field-label">Tool *</div>
            <select value={tcioForm.toolId} onChange={e => setTcioForm(f => ({ ...f, toolId: e.target.value }))}>
              <option value="">— Select tool —</option>
              {toolItems.map(t => <option key={t.id} value={t.id}>{t.name} (Qty: {t.qty})</option>)}
            </select>
          </div>
          <div className="field"><div className="field-label">Quantity *</div><input type="number" value={tcioForm.qty} placeholder="1" min="1" onChange={e => setTcioForm(f => ({ ...f, qty: e.target.value }))} /></div>
          <div className="field"><div className="field-label">Staff / Person *</div><input type="text" value={tcioForm.staff} placeholder="Who is checking out/in?" onChange={e => setTcioForm(f => ({ ...f, staff: e.target.value }))} /></div>
        </div>
        <div className="field" style={{ marginBottom: 16 }}><div className="field-label">Notes (optional)</div><input type="text" value={tcioForm.notes} placeholder="e.g. Used for morning shift…" onChange={e => setTcioForm(f => ({ ...f, notes: e.target.value }))} /></div>
        <button className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={onSubmit}>Log Entry</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Check-In/Out History</div>
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <div className="search-box" style={{ minWidth: 120, flex: 1, maxWidth: 240 }}>{SEARCH_ICON}<input type="text" value={tcioSearch} placeholder="Search…" onChange={e => setTcioSearch(e.target.value)} /></div>
          <select value={tcioFilter} onChange={e => setTcioFilter(e.target.value)} style={{ minWidth: 110, width: 'auto' }}>
            <option value="All">All</option><option value="checkout">Check-Out</option><option value="checkin">Check-In</option>
          </select>
        </div>
      </div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Date &amp; Time</th><th>Type</th><th>Tool</th><th>Qty</th><th>Staff</th><th>Notes</th></tr></thead>
        <tbody>
          {recs.length ? recs.map(r => {
            const d = new Date(r.date), tool = toolItems.find(t => t.id === r.toolId)
            return (
              <tr key={r.id}>
                <td className="td-mono">{d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} {d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</td>
                <td><span className={`badge ${r.type === 'checkin' ? 'badge-green' : 'badge-red'}`}>{r.type === 'checkin' ? 'Check-In' : 'Check-Out'}</span></td>
                <td className="td-name">{tool?.name || '—'}</td>
                <td className="td-mono" style={{ fontWeight: 700 }}>{r.qty}</td>
                <td style={{ fontSize: 12, color: 'var(--text2)' }}>{r.staff || '—'}</td>
                <td style={{ fontSize: 12, color: 'var(--text3)' }}>{r.notes || '—'}</td>
              </tr>
            )
          }) : <tr><td colSpan={6}><div className="empty-state"><div className="empty-title">No entries yet</div><div className="empty-sub">Log a check-in or check-out above</div></div></td></tr>}
        </tbody>
      </table></div></div>
    </div>
  )
}

// ── ORDERS ──
function OrdersPage({ orders, customers, services, isAdmin, peso, orderSearch, setOrderSearch, orderFilter, setOrderFilter, onNewOrder, onViewOrder, onMarkPaid, onMarkOverdue, onUpdateDelivery, onToggleApproval }) {
  const [custFilter, setCustFilter] = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('All')
  const getCustomerN = (id) => { const c = customers.find(c => c.id === id); return c || { name: 'Unknown', phone: '' } }
  const getServiceN = (id) => services.find(s => s.id === id) || { name: '?', price: 0 }
  const paid = orders.filter(o => o.status === 'Paid').reduce((s, o) => s + o.total, 0)
  const unpaid = orders.filter(o => o.status === 'Unpaid').reduce((s, o) => s + o.total, 0)
  const overdue = orders.filter(o => o.status === 'Overdue').reduce((s, o) => s + o.total, 0)
  const q = orderSearch.toLowerCase()
  const shown = [...orders].reverse().filter(o => {
    const c = getCustomerN(o.customerId)
    const mq = !q || c.name.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || (o.dr_number || '').toLowerCase().includes(q)
    const ms = orderFilter === 'All' || o.status === orderFilter
    const mc = !custFilter || String(o.customerId) === custFilter
    const md = deliveryFilter === 'All' || o.deliveryStatus === deliveryFilter
    return mq && ms && mc && md
  })
  const SB = { Paid: 'badge-green', Unpaid: 'badge-blue', Overdue: 'badge-red', Cancelled: 'badge-gray' }

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Orders</div><div className="section-sub">Create orders and manage invoices</div></div>
        {isAdmin && <button className="btn btn-primary" onClick={onNewOrder}>+ New Order</button>}
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-val accent">{orders.length}</div></div>
        <div className="stat-card"><div className="stat-label">Collected</div><div className="stat-val green">{peso(paid)}</div></div>
        <div className="stat-card"><div className="stat-label">Unpaid</div><div className="stat-val warn">{peso(unpaid)}</div></div>
        <div className="stat-card"><div className="stat-label">Overdue</div><div className="stat-val danger">{peso(overdue)}</div></div>
      </div>
      <div className="toolbar">
        <div className="search-box">{SEARCH_ICON}<input type="text" value={orderSearch} placeholder="Search order ID…" onChange={e => setOrderSearch(e.target.value)} /></div>
        <select value={custFilter} onChange={e => setCustFilter(e.target.value)} style={{ minWidth: 140 }}>
          <option value="">All Customers</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={deliveryFilter} onChange={e => setDeliveryFilter(e.target.value)} style={{ minWidth: 120 }}>
          <option value="All">All Delivery</option><option value="Pending">Pending</option><option value="Sent">Sent</option><option value="Delivered">Delivered</option>
        </select>
        <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}>
          <option value="All">All Payment</option><option value="Unpaid">Unpaid</option><option value="Paid">Paid</option><option value="Overdue">Overdue</option><option value="Cancelled">Cancelled</option>
        </select>
      </div>
      {shown.length ? shown.map(o => {
        const c = getCustomerN(o.customerId)
        const linesDesc = o.lines?.length ? o.lines.map(l => {
          const svcIds = l.serviceIds || []
          const svcs = svcIds.map(id => getServiceN(id)).filter(Boolean)
          const svcCost = svcs.reduce((s, svc) => s + svc.price * l.qty, 0)
          const lt = l.qty * l.pricePerBlock + svcCost
          return `${l.qty} block${l.qty !== 1 ? 's' : ''} — ${svcs.length ? svcs.map(s => s.name).join(' + ') : 'Whole'} = ${peso(lt)}`
        }).join(', ') : `${o.blocks} blocks`
        return (
          <div key={o.id} className="invoice-card">
            <div className="inv-header">
              <div>
                <div className="inv-id">
                  {o.id} · {new Date(o.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                  {o.dr_number && <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text3)' }}>DR: {o.dr_number}</span>}
                </div>
                <div className="inv-customer">{c.name}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <span className={`badge ${o.deliveryStatus === 'Sent' ? 'badge-warn' : o.deliveryStatus === 'Delivered' ? 'badge-green' : 'badge-gray'}`}>{o.deliveryStatus || 'Pending'}</span>
                  {o.approved_for_invoicing && !o.invoiced && <span className="badge badge-green">Approved</span>}
                  {o.invoiced && <span className="badge badge-purple">SOA Generated</span>}
                  {o.soaNumber && <span style={{ fontSize: 10, color: 'var(--text3)', alignSelf: 'center' }}>{o.soaNumber}</span>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="inv-amount">{peso(o.total)}</div>
                <span className={`badge ${SB[o.status] || 'badge-gray'}`} style={{ display: 'inline-flex', marginTop: 5 }}>{o.status}</span>
              </div>
            </div>
            <div className="inv-lines">
              {linesDesc}{o.notes ? <><br /><em>{o.notes}</em></> : ''}
              {o.plate_number && <><br /><span style={{ fontSize: 11, color: 'var(--text3)' }}>Plate: {o.plate_number}</span></>}
            </div>
            {o.status === 'Paid' && o.payment && (
              <div style={{ fontSize: 12, color: '#22c55e', marginBottom: 8 }}>Paid via {o.payment.method} on {new Date(o.payment.date).toLocaleDateString('en-PH')} · Recorded by {o.payment.staff}</div>
            )}
            <div className="inv-footer">
              <span className="inv-meta-item">{c.phone || ''}</span>
              <div className="inv-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => onViewOrder(o.id)}>View Invoice</button>
                {isAdmin && o.deliveryStatus === 'Pending' && <button className="btn btn-warn btn-sm" onClick={() => onUpdateDelivery(o.id, 'Sent')}>Mark Sent</button>}
                {isAdmin && o.deliveryStatus === 'Sent' && <button className="btn btn-ghost btn-sm" onClick={() => onUpdateDelivery(o.id, 'Delivered')}>Mark Delivered</button>}
                {isAdmin && o.deliveryStatus === 'Sent' && !o.invoiced && (
                  <button className={`btn btn-sm ${o.approved_for_invoicing ? 'btn-danger' : 'btn-success'}`} onClick={() => onToggleApproval(o.id)}>
                    {o.approved_for_invoicing ? 'Revoke Approval' : 'Approve for SOA'}
                  </button>
                )}
                {isAdmin && (o.status === 'Unpaid' || o.status === 'Overdue') && <button className="btn btn-success btn-sm" onClick={() => onMarkPaid(o.id)}>Mark Paid</button>}
                {isAdmin && o.status === 'Unpaid' && <button className="btn btn-warn btn-sm" onClick={() => onMarkOverdue(o.id)}>Mark Overdue</button>}
              </div>
            </div>
          </div>
        )
      }) : <div className="empty-state"><div className="empty-title">No orders found</div><div className="empty-sub">Create a new order to get started</div></div>}
    </div>
  )
}

// ── SERVICES ──
function ServicesPage({ services, isAdmin, peso, onAdd, onEdit, onDelete }) {
  const avg = services.reduce((s, sv) => s + sv.price, 0) / Math.max(services.length, 1)
  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Services</div><div className="section-sub">Add-on services available on orders</div></div>
        {isAdmin && <button className="btn btn-primary" onClick={onAdd}>+ Add Service</button>}
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Services</div><div className="stat-val accent">{services.length}</div></div>
        <div className="stat-card"><div className="stat-label">Avg Price</div><div className="stat-val">{peso(avg)}</div></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {services.map(s => (
          <div key={s.id} className="service-card">
            <div style={{ flex: 1 }}><div className="service-name">{s.name}</div><div style={{ fontSize: 12, color: 'var(--text3)' }}>{s.unit}{s.desc ? ' — ' + s.desc : ''}</div></div>
            <div className="service-price">{peso(s.price)}</div>
            {isAdmin && <><button className="btn btn-ghost btn-sm" onClick={() => onEdit(s.id)}>Edit</button><button className="btn btn-danger btn-sm" onClick={() => onDelete(s.id)}>Del</button></>}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── CUSTOMERS ──
function CustomersPage({ customers, orders, isAdmin, peso, custSearch, setCustSearch, reminderDays, setReminderDays, viewingCustomerId, setViewingCustomerId, onAdd, onEdit, onDelete, onViewOrders }) {
  const now = Date.now()
  const q = custSearch.toLowerCase()
  const shown = customers.filter(c => !q || c.name.toLowerCase().includes(q) || (c.contact || '').toLowerCase().includes(q))
  const withBalance = customers.filter(c => orders.some(o => (o.status === 'Unpaid' || o.status === 'Overdue') && o.customerId === c.id)).length
  const overdueCount = customers.filter(c => orders.some(o => o.status === 'Overdue' && o.customerId === c.id)).length

  const detailCustomer = viewingCustomerId ? customers.find(c => c.id === viewingCustomerId) : null
  const detailOrders = detailCustomer ? [...orders].filter(o => o.customerId === detailCustomer.id).sort((a, b) => new Date(b.date) - new Date(a.date)) : []
  const detailBalance = detailOrders.filter(o => o.status === 'Unpaid' || o.status === 'Overdue').reduce((s, o) => s + o.total, 0)
  const detailTotal = detailOrders.filter(o => o.status === 'Paid').reduce((s, o) => s + o.total, 0)
  const SB = { Paid: 'badge-green', Unpaid: 'badge-blue', Overdue: 'badge-red', Cancelled: 'badge-gray' }

  if (detailCustomer) {
    return (
      <div className="page">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setViewingCustomerId(null)}>← Back</button>
          <div style={{ flex: 1 }}>
            <div className="section-title">{detailCustomer.name}</div>
            <div className="section-sub">Customer detail</div>
          </div>
          {isAdmin && <button className="btn btn-ghost btn-sm" onClick={() => onEdit(detailCustomer.id)}>Edit</button>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 18 }}>
          <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-val accent">{detailOrders.length}</div></div>
          <div className="stat-card"><div className="stat-label">Total Paid</div><div className="stat-val green">{peso(detailTotal)}</div></div>
          <div className="stat-card"><div className="stat-label">Outstanding</div><div className={`stat-val ${detailBalance > 0 ? 'danger' : 'green'}`}>{detailBalance > 0 ? peso(detailBalance) : 'Clear'}</div></div>
        </div>

        <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Contact Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 8, fontSize: 13 }}>
            <div><span style={{ color: 'var(--text3)' }}>Contact Person: </span>{detailCustomer.contact || '—'}</div>
            <div><span style={{ color: 'var(--text3)' }}>Phone: </span>{detailCustomer.phone || '—'}</div>
            <div><span style={{ color: 'var(--text3)' }}>Email: </span>{detailCustomer.email || '—'}</div>
            <div><span style={{ color: 'var(--text3)' }}>Area: </span>{detailCustomer.area || '—'}</div>
            {detailCustomer.notes && <div style={{ gridColumn: '1/-1' }}><span style={{ color: 'var(--text3)' }}>Notes: </span>{detailCustomer.notes}</div>}
          </div>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Order History</div>
        <div className="table-card"><div className="table-scroll"><table>
          <thead><tr><th>Order ID</th><th>Date</th><th>Due Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {detailOrders.length ? detailOrders.map(o => (
              <tr key={o.id}>
                <td className="td-mono">{o.id}</td>
                <td style={{ fontSize: 12 }}>{new Date(o.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td style={{ fontSize: 12, color: (o.status === 'Overdue') ? '#ef4444' : 'var(--text2)' }}>{o.dueDate ? new Date(o.dueDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                <td className="td-mono" style={{ fontWeight: 600 }}>{peso(o.total)}</td>
                <td><span className={`badge ${SB[o.status] || 'badge-gray'}`}>{o.status}</span></td>
              </tr>
            )) : <tr><td colSpan={5}><div className="empty-state"><div className="empty-title">No orders yet</div></div></td></tr>}
          </tbody>
        </table></div></div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Customers</div><div className="section-sub">Manage customer accounts</div></div>
        <button className="btn btn-primary" onClick={onAdd}>+ Add Customer</button>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Customers</div><div className="stat-val accent">{customers.length}</div></div>
        <div className="stat-card"><div className="stat-label">With Balance</div><div className="stat-val warn">{withBalance}</div></div>
        <div className="stat-card"><div className="stat-label">Overdue</div><div className="stat-val danger">{overdueCount}</div></div>
      </div>
      <div className="toolbar"><div className="search-box">{SEARCH_ICON}<input type="text" value={custSearch} placeholder="Search customers…" onChange={e => setCustSearch(e.target.value)} /></div></div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Customer</th><th className="cust-table-hide">Phone</th><th>Balance</th><th></th></tr></thead>
        <tbody>
          {shown.map(c => {
            const unpaidOrders = orders.filter(o => o.customerId === c.id && (o.status === 'Unpaid' || o.status === 'Overdue'))
            const balance = unpaidOrders.reduce((s, o) => s + o.total, 0)
            const hasOverdue = unpaidOrders.some(o => o.status === 'Overdue')
            return (
              <tr key={c.id} onClick={() => setViewingCustomerId(c.id)} style={{ cursor: 'pointer', ...(hasOverdue ? { background: 'rgba(239,68,68,0.04)' } : {}) }}>
                <td>
                  <div className="td-name">{c.name}</div>
                  {c.area && <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.area}</div>}
                </td>
                <td className="cust-table-hide" style={{ fontSize: 12 }}>{c.phone || '—'}</td>
                <td className="td-mono" style={{ color: balance > 0 ? '#ef4444' : '#22c55e', fontWeight: balance > 0 ? 700 : 400 }}>
                  {balance > 0 ? peso(balance) : 'Clear'}
                  {hasOverdue && <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 600 }}>OVERDUE</div>}
                </td>
                <td><div className="td-actions" onClick={e => e.stopPropagation()}>
                  {isAdmin && <button className="btn-icon" onClick={() => onEdit(c.id)}>Edit</button>}
                  {isAdmin && <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => onDelete(c.id)}>Del</button>}
                </div></td>
              </tr>
            )
          })}
          {!shown.length && <tr><td colSpan={4}><div className="empty-state"><div className="empty-title">No customers</div></div></td></tr>}
        </tbody>
      </table></div></div>
    </div>
  )
}

// ── VENDORS ──
function VendorsPage({ vendors, isAdmin, vendorSearch, setVendorSearch, onAdd, onEdit, onDelete }) {
  const q = vendorSearch.toLowerCase()
  const shown = vendors.filter(v => !q || v.name.toLowerCase().includes(q))
  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Vendors</div><div className="section-sub">Ice suppliers &amp; sources</div></div>
        {isAdmin && <button className="btn btn-primary" onClick={onAdd}>+ Add Vendor</button>}
      </div>
      <div className="stats-grid"><div className="stat-card"><div className="stat-label">Vendors</div><div className="stat-val accent">{vendors.length}</div></div></div>
      <div className="toolbar"><div className="search-box">{SEARCH_ICON}<input type="text" value={vendorSearch} placeholder="Search vendors…" onChange={e => setVendorSearch(e.target.value)} /></div></div>
      <div className="vendor-grid">
        {shown.length ? shown.map(v => (
          <div key={v.id} className="vendor-card">
            <div className="vc-name">{v.name}</div>
            <div className="vc-meta">{v.terms}{v.city ? ' · ' + v.city : ''}</div>
            <div style={{ marginTop: 8 }}>
              <div className="vc-contact">Contact: {v.contact || '—'}</div>
              <div className="vc-contact">Phone: {v.phone || '—'}</div>
              <div className="vc-contact">Email: {v.email || '—'}</div>
            </div>
            {v.notes && <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 6 }}>{v.notes}</div>}
            {isAdmin && <div className="vc-actions"><button className="btn btn-ghost btn-sm" onClick={() => onEdit(v.id)}>Edit</button><button className="btn btn-danger btn-sm" onClick={() => onDelete(v.id)}>Delete</button></div>}
          </div>
        )) : <div className="empty-state" style={{ gridColumn: '1/-1' }}><div className="empty-title">No vendors yet</div></div>}
      </div>
    </div>
  )
}


// ── SOA ──
function SOAPage({ orders, soas, customers, peso, soaCustFilter, setSoaCustFilter, onGenerate, onViewOrder }) {
  const [selectedOrders, setSelectedOrders] = useState({})
  const [dateFrom, setDateFrom] = useState(() => { const d = new Date(); d.setDate(d.getDate() - 7); return d.toISOString().split('T')[0] })
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0])

  const getCustomerName = (id) => customers.find(c => c.id === id)?.name || 'Unknown'

  const eligible = orders.filter(o => {
    const d = new Date(o.date)
    const from = new Date(dateFrom + 'T00:00:00')
    const to = new Date(dateTo + 'T23:59:59')
    return o.deliveryStatus === 'Sent' && o.approved_for_invoicing && !o.invoiced && d >= from && d <= to
  })
  const filtered = soaCustFilter ? eligible.filter(o => String(o.customerId) === soaCustFilter) : eligible

  const byCustomer = {}
  filtered.forEach(o => {
    if (!byCustomer[o.customerId]) byCustomer[o.customerId] = []
    byCustomer[o.customerId].push(o)
  })

  function toggleOrder(orderId) { setSelectedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] })) }
  function selectAll(custId, custOrders) {
    const allSelected = custOrders.every(o => selectedOrders[o.id])
    const update = {}; custOrders.forEach(o => { update[o.id] = !allSelected })
    setSelectedOrders(prev => ({ ...prev, ...update }))
  }
  function handleGenerate(custId) {
    const custOrders = byCustomer[custId] || []
    const ids = custOrders.filter(o => selectedOrders[o.id]).map(o => o.id)
    if (!ids.length) return
    onGenerate(custId, ids)
    setSelectedOrders(prev => { const n = { ...prev }; ids.forEach(id => delete n[id]); return n })
  }

  const SB = { Paid: 'badge-green', Unpaid: 'badge-blue', Overdue: 'badge-red', Cancelled: 'badge-gray' }

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Statement of Account</div><div className="section-sub">Generate SOA from orders that are Sent and Approved for invoicing</div></div>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Pending SOA</div><div className="stat-val warn">{eligible.length}</div><div className="stat-trend">Sent + Approved, not yet invoiced</div></div>
        <div className="stat-card"><div className="stat-label">SOAs Generated</div><div className="stat-val accent">{soas.length}</div></div>
        <div className="stat-card"><div className="stat-label">Pending Value</div><div className="stat-val danger">{peso(eligible.reduce((s, o) => s + o.total, 0))}</div></div>
      </div>
      <div className="toolbar" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={soaCustFilter} onChange={e => setSoaCustFilter(e.target.value)} style={{ minWidth: 160 }}>
          <option value="">All Customers</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap' }}>Period:</span>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ width: 140 }} />
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>→</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ width: 140 }} />
        </div>
      </div>
      {Object.keys(byCustomer).length > 0 ? (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Eligible Orders (Sent, Not Yet Invoiced)</div>
          {Object.entries(byCustomer).map(([custId, custOrders]) => {
            const cid = parseInt(custId)
            const custName = getCustomerName(cid)
            const selCount = custOrders.filter(o => selectedOrders[o.id]).length
            const selTotal = custOrders.filter(o => selectedOrders[o.id]).reduce((s, o) => s + o.total, 0)
            const customer = customers.find(c => c.id === cid)
            return (
              <div key={custId} style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 14, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--dark2)', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{custName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)' }}>SOA Start #{customer?.soaStartNum ?? 1} · OLC Start #{customer?.olcStartNum ?? 1}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    {selCount > 0 && <div style={{ fontSize: 12, color: 'var(--blue)' }}>{selCount} selected · {peso(selTotal)}</div>}
                    <button className="btn btn-ghost btn-sm" onClick={() => selectAll(cid, custOrders)}>{custOrders.every(o => selectedOrders[o.id]) ? 'Deselect All' : 'Select All'}</button>
                    <button className="btn btn-primary btn-sm" disabled={selCount === 0} onClick={() => handleGenerate(cid)} style={{ opacity: selCount === 0 ? 0.4 : 1 }}>Generate SOA ({selCount})</button>
                  </div>
                </div>
                {custOrders.map(o => (
                  <div key={o.id} onClick={() => toggleOrder(o.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selectedOrders[o.id] ? 'rgba(14,165,233,0.06)' : 'transparent', transition: 'background .15s' }}>
                    <input type="checkbox" checked={!!selectedOrders[o.id]} onChange={() => toggleOrder(o.id)} onClick={e => e.stopPropagation()} style={{ width: 16, height: 16, cursor: 'pointer', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13 }}>{o.id}</span>
                        {o.dr_number && <span style={{ fontSize: 11, color: 'var(--text3)' }}>DR: {o.dr_number}</span>}
                        {o.plate_number && <span style={{ fontSize: 11, color: 'var(--text3)' }}>Plate: {o.plate_number}</span>}
                        <span className={`badge ${SB[o.status] || 'badge-gray'}`}>{o.status}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                        {new Date(o.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })} · Due: {o.dueDate ? new Date(o.dueDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }) : '—'}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--blue)', flexShrink: 0 }}>{peso(o.total)}</div>
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); onViewOrder(o.id) }}>View</button>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="empty-state" style={{ marginBottom: 24 }}>
          <div className="empty-title">No eligible orders</div>
          <div className="empty-sub">Orders must be marked as "Sent" and "Approved for SOA" on the Orders page</div>
        </div>
      )}
      {soas.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Generated SOAs</div>
          <div className="table-card"><div className="table-scroll"><table>
            <thead><tr><th>SOA Number</th><th>OLC #</th><th>Customer</th><th>Orders</th><th>Total</th><th>Generated</th><th>By</th></tr></thead>
            <tbody>
              {soas.map(s => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--blue)' }}>{s.soaNumber}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{s.olcNumber}</td>
                  <td>{getCustomerName(s.customerId)}</td>
                  <td style={{ fontSize: 12 }}>
                    {s.orderIds.map(id => (
                      <span key={id} style={{ marginRight: 6, cursor: 'pointer', color: 'var(--blue)', textDecoration: 'underline' }} onClick={() => onViewOrder(id)}>{id}</span>
                    ))}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#22c55e' }}>{peso(s.total)}</td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{new Date(s.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={{ fontSize: 12, color: 'var(--text3)' }}>{s.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table></div></div>
        </>
      )}
    </div>
  )
}

// ── EXPENSES ──
function ExpensesPage({ expenses, isAdmin, peso, expenseSearch, setExpenseSearch, expenseCatFilter, setExpenseCatFilter, onAdd, onEdit, onDelete }) {
  const q = expenseSearch.toLowerCase()
  const shown = [...expenses].reverse().filter(e => {
    const mq = !q || e.vendor.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
    const mc = expenseCatFilter === 'All' || e.category === expenseCatFilter
    return mq && mc
  })
  const total = shown.reduce((s, e) => s + e.amount, 0)
  const thisMonth = expenses.filter(e => { const d = new Date(e.date); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).reduce((s, e) => s + e.amount, 0)
  const byCategory = EXPENSE_CATEGORIES.map(cat => ({ cat, total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0) })).filter(x => x.total > 0).sort((a, b) => b.total - a.total)

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Expenses</div><div className="section-sub">Track all business expenses</div></div>
        <button className="btn btn-primary" onClick={onAdd}>+ Add Expense</button>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Expenses</div><div className="stat-val danger">{peso(expenses.reduce((s,e)=>s+e.amount,0))}</div></div>
        <div className="stat-card"><div className="stat-label">This Month</div><div className="stat-val warn">{peso(thisMonth)}</div></div>
        <div className="stat-card"><div className="stat-label">Filtered Total</div><div className="stat-val">{peso(total)}</div></div>
        <div className="stat-card"><div className="stat-label">Records</div><div className="stat-val accent">{expenses.length}</div></div>
      </div>
      {byCategory.length > 0 && (
        <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Expenses by Category</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {byCategory.map(({ cat, total: catTotal }) => {
              const pct = Math.round((catTotal / expenses.reduce((s,e)=>s+e.amount,1)) * 100)
              return (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 100, fontSize: 12, color: 'var(--text2)', flexShrink: 0 }}>{cat}</div>
                  <div style={{ flex: 1, height: 6, background: 'var(--dark2)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: pct + '%', background: 'var(--blue)', borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 80, textAlign: 'right', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{peso(catTotal)}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
      <div className="toolbar">
        <div className="search-box">{SEARCH_ICON}<input type="text" value={expenseSearch} placeholder="Search vendor, description…" onChange={e => setExpenseSearch(e.target.value)} /></div>
        <select value={expenseCatFilter} onChange={e => setExpenseCatFilter(e.target.value)}>
          <option value="All">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Date</th><th>Vendor / Payee</th><th>Category</th><th>Description</th><th>Method</th><th>Amount</th><th></th></tr></thead>
        <tbody>
          {shown.length ? shown.map(e => (
            <tr key={e.id}>
              <td className="td-mono" style={{ fontSize: 12 }}>{new Date(e.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              <td className="td-name">{e.vendor}</td>
              <td><span className="badge badge-blue">{e.category || '—'}</span></td>
              <td style={{ fontSize: 12, color: 'var(--text2)' }}>{e.description || '—'}</td>
              <td style={{ fontSize: 12 }}>{e.method}</td>
              <td className="td-mono" style={{ color: '#ef4444', fontWeight: 700 }}>{peso(e.amount)}</td>
              <td><div className="td-actions">
                <button className="btn-icon" onClick={() => onEdit(e.id)}>Edit</button>
                {isAdmin && <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => onDelete(e.id)}>Del</button>}
              </div></td>
            </tr>
          )) : <tr><td colSpan={7}><div className="empty-state"><div className="empty-title">No expenses found</div></div></td></tr>}
        </tbody>
      </table></div></div>
    </div>
  )
}

// ── CLOCK IN/OUT ──
function ClockPage({ appUsers, clockRecords, currentUser, clockForm, setClockForm, clockSearch, setClockSearch, onSubmit, onClockOut, onDelete }) {
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superadmin'
  const q = clockSearch.toLowerCase()
  const shown = [...clockRecords].reverse().filter(r => !q || r.userName.toLowerCase().includes(q))
  const totalHoursToday = clockRecords.filter(r => new Date(r.clockIn).toDateString() === new Date().toDateString() && r.totalHours).reduce((s, r) => s + r.totalHours, 0)
  const activeNow = clockRecords.filter(r => !r.clockOut)

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Clock In / Clock Out</div><div className="section-sub">Staff attendance tracking</div></div>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Clocked In Now</div><div className="stat-val accent">{activeNow.length}</div></div>
        <div className="stat-card"><div className="stat-label">Hours Today</div><div className="stat-val green">{totalHoursToday.toFixed(1)} hrs</div></div>
        <div className="stat-card"><div className="stat-label">Total Records</div><div className="stat-val">{clockRecords.length}</div></div>
      </div>

      {activeNow.length > 0 && (
        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: '#22c55e', marginBottom: 8 }}>Currently Clocked In</div>
          {activeNow.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(34,197,94,0.1)', gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.userName}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>Since {new Date(r.clockIn).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <button className="btn btn-success btn-sm" onClick={() => onClockOut(r.id)}>Clock Out Now</button>
            </div>
          ))}
        </div>
      )}

      <div className="cio-panel" style={{ marginBottom: 20 }}>
        <div className="cio-title">Log Clock Entry</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div className="field full"><div className="field-label">Staff Member *</div>
            <select value={clockForm.userId} onChange={e => setClockForm(f => ({ ...f, userId: e.target.value }))}>
              <option value="">— Select user —</option>
              {appUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
            </select>
          </div>
          <div className="field"><div className="field-label">Clock In *</div><input type="datetime-local" value={clockForm.clockIn} onChange={e => setClockForm(f => ({ ...f, clockIn: e.target.value }))} /></div>
          <div className="field"><div className="field-label">Clock Out (optional)</div><input type="datetime-local" value={clockForm.clockOut} onChange={e => setClockForm(f => ({ ...f, clockOut: e.target.value }))} /></div>
          <div className="field full"><div className="field-label">Notes</div><input type="text" value={clockForm.notes} onChange={e => setClockForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional…" /></div>
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onSubmit}>Log Entry</button>
      </div>

      <div className="toolbar" style={{ marginBottom: 12 }}>
        <div className="search-box">{SEARCH_ICON}<input type="text" value={clockSearch} placeholder="Search staff…" onChange={e => setClockSearch(e.target.value)} /></div>
      </div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Staff</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>Notes</th><th></th></tr></thead>
        <tbody>
          {shown.length ? shown.map(r => (
            <tr key={r.id}>
              <td className="td-name">{r.userName}</td>
              <td className="td-mono" style={{ fontSize: 12 }}>{new Date(r.clockIn).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              <td className="td-mono" style={{ fontSize: 12 }}>{r.clockOut ? new Date(r.clockOut).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : <span className="badge badge-green">Active</span>}</td>
              <td className="td-mono" style={{ fontWeight: 600 }}>{r.totalHours != null ? r.totalHours.toFixed(1) + ' h' : '—'}</td>
              <td style={{ fontSize: 12, color: 'var(--text3)' }}>{r.notes || '—'}</td>
              <td><div className="td-actions">
                {!r.clockOut && <button className="btn-icon" style={{ color: '#22c55e' }} onClick={() => onClockOut(r.id)}>Clock Out</button>}
                {isAdmin && <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => onDelete(r.id)}>Del</button>}
              </div></td>
            </tr>
          )) : <tr><td colSpan={6}><div className="empty-state"><div className="empty-title">No clock records yet</div></div></td></tr>}
        </tbody>
      </table></div></div>
    </div>
  )
}

// ── REPORTS ──
function ReportsPage({ orders, expenses, customers, services, cioRecords, brokenIce, clockRecords, iceStock, peso }) {
  const [reportType, setReportType] = useState('orders')
  const [dateFrom, setDateFrom] = useState(() => { const d = new Date(); d.setDate(1); return d.toISOString().split('T')[0] })
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0])

  function exportCSV(rows, headers, filename) {
    const lines = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))]
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename + '.csv'; a.click()
  }

  const from = new Date(dateFrom + 'T00:00:00')
  const to = new Date(dateTo + 'T23:59:59')
  const inRange = (iso) => { const d = new Date(iso); return d >= from && d <= to }

  const filteredOrders = orders.filter(o => inRange(o.date))
  const filteredExpenses = expenses.filter(e => inRange(e.date))
  const filteredStock = cioRecords.filter(r => inRange(r.date))
  const filteredClock = clockRecords.filter(r => inRange(r.clockIn))

  const totalRevenue = filteredOrders.filter(o => o.status === 'Paid').reduce((s, o) => s + o.total, 0)
  const totalExpense = filteredExpenses.reduce((s, e) => s + e.amount, 0)
  const netProfit = totalRevenue - totalExpense
  const totalProduced = filteredStock.filter(r => r.type === 'in').reduce((s, r) => s + r.qty, 0)
  const totalSold = filteredStock.filter(r => r.type === 'out').reduce((s, r) => s + r.qty, 0)

  const getCustomerName = (id) => { const c = customers.find(c => c.id === id); return c?.name || 'Unknown' }

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Reports</div><div className="section-sub">Generate and export reports</div></div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="field" style={{ flex: 1, minWidth: 140 }}><div className="field-label">From</div><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
        <div className="field" style={{ flex: 1, minWidth: 140 }}><div className="field-label">To</div><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card"><div className="stat-label">Revenue (Paid)</div><div className="stat-val green">{peso(totalRevenue)}</div></div>
        <div className="stat-card"><div className="stat-label">Total Expenses</div><div className="stat-val danger">{peso(totalExpense)}</div></div>
        <div className="stat-card"><div className="stat-label">Net Profit</div><div className={`stat-val ${netProfit >= 0 ? 'green' : 'danger'}`}>{peso(netProfit)}</div></div>
        <div className="stat-card"><div className="stat-label">Blocks Produced</div><div className="stat-val accent">{totalProduced}</div></div>
        <div className="stat-card"><div className="stat-label">Blocks Sold</div><div className="stat-val">{totalSold}</div></div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['orders', 'expenses', 'stock', 'clock'].map(t => (
          <button key={t} className={`btn ${reportType === t ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setReportType(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {reportType === 'orders' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Orders Report ({filteredOrders.length} orders)</div>
            <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(
              filteredOrders.map(o => [o.id, getCustomerName(o.customerId), new Date(o.date).toLocaleDateString('en-PH'), o.status, o.total, o.blocks]),
              ['Order ID', 'Customer', 'Date', 'Status', 'Total', 'Blocks'], 'orders-report'
            )}>Export CSV</button>
          </div>
          <div className="table-card"><div className="table-scroll"><table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Due Date</th><th>Blocks</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {filteredOrders.length ? filteredOrders.map(o => (
                <tr key={o.id}>
                  <td className="td-mono">{o.id}</td>
                  <td>{getCustomerName(o.customerId)}</td>
                  <td style={{ fontSize: 12 }}>{new Date(o.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={{ fontSize: 12, color: o.status === 'Overdue' ? '#ef4444' : 'var(--text2)' }}>{o.dueDate ? new Date(o.dueDate).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                  <td className="td-mono">{o.blocks}</td>
                  <td className="td-mono" style={{ fontWeight: 600 }}>{peso(o.total)}</td>
                  <td><span className={`badge ${{ Paid: 'badge-green', Unpaid: 'badge-blue', Overdue: 'badge-red', Cancelled: 'badge-gray' }[o.status] || 'badge-gray'}`}>{o.status}</span></td>
                </tr>
              )) : <tr><td colSpan={7}><div className="empty-state"><div className="empty-title">No orders in range</div></div></td></tr>}
            </tbody>
          </table></div></div>
        </>
      )}

      {reportType === 'expenses' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Expenses Report ({filteredExpenses.length} records)</div>
            <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(
              filteredExpenses.map(e => [new Date(e.date).toLocaleDateString('en-PH'), e.vendor, e.category, e.description, e.amount, e.method, e.ref]),
              ['Date', 'Vendor', 'Category', 'Description', 'Amount', 'Method', 'Reference'], 'expenses-report'
            )}>Export CSV</button>
          </div>
          <div className="table-card"><div className="table-scroll"><table>
            <thead><tr><th>Date</th><th>Vendor</th><th>Category</th><th>Description</th><th>Method</th><th>Amount</th></tr></thead>
            <tbody>
              {filteredExpenses.length ? filteredExpenses.map(e => (
                <tr key={e.id}>
                  <td className="td-mono" style={{ fontSize: 12 }}>{new Date(e.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>{e.vendor}</td>
                  <td><span className="badge badge-blue">{e.category}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text2)' }}>{e.description}</td>
                  <td style={{ fontSize: 12 }}>{e.method}</td>
                  <td className="td-mono" style={{ color: '#ef4444', fontWeight: 700 }}>{peso(e.amount)}</td>
                </tr>
              )) : <tr><td colSpan={6}><div className="empty-state"><div className="empty-title">No expenses in range</div></div></td></tr>}
            </tbody>
          </table></div></div>
        </>
      )}

      {reportType === 'stock' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Stock Movement Report ({filteredStock.length} entries)</div>
            <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(
              filteredStock.map(r => [new Date(r.date).toLocaleDateString('en-PH'), r.type, r.qty, r.staff, r.ref]),
              ['Date', 'Type', 'Quantity', 'Staff', 'Notes'], 'stock-report'
            )}>Export CSV</button>
          </div>
          <div className="table-card"><div className="table-scroll"><table>
            <thead><tr><th>Date</th><th>Type</th><th>Blocks</th><th>Staff</th><th>Notes</th></tr></thead>
            <tbody>
              {filteredStock.length ? filteredStock.map(r => {
                const isIn = r.type === 'in' || r.type === 'restore'
                return (
                  <tr key={r.id}>
                    <td className="td-mono" style={{ fontSize: 12 }}>{new Date(r.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><span className={`badge ${{ in: 'badge-green', out: 'badge-blue', restore: 'badge-warn' }[r.type] || 'badge-gray'}`}>{r.type}</span></td>
                    <td className="td-mono" style={{ color: isIn ? '#22c55e' : '#0ea5e9', fontWeight: 600 }}>{isIn ? '+' : '-'}{r.qty}</td>
                    <td style={{ fontSize: 12 }}>{r.staff}</td>
                    <td style={{ fontSize: 12, color: 'var(--text3)' }}>{r.ref}</td>
                  </tr>
                )
              }) : <tr><td colSpan={5}><div className="empty-state"><div className="empty-title">No stock entries in range</div></div></td></tr>}
            </tbody>
          </table></div></div>
        </>
      )}

      {reportType === 'clock' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>Attendance Report ({filteredClock.length} records)</div>
            <button className="btn btn-ghost btn-sm" onClick={() => exportCSV(
              filteredClock.map(r => [r.userName, new Date(r.clockIn).toLocaleString('en-PH'), r.clockOut ? new Date(r.clockOut).toLocaleString('en-PH') : '', r.totalHours ?? '']),
              ['Staff', 'Clock In', 'Clock Out', 'Total Hours'], 'attendance-report'
            )}>Export CSV</button>
          </div>
          <div className="table-card"><div className="table-scroll"><table>
            <thead><tr><th>Staff</th><th>Clock In</th><th>Clock Out</th><th>Hours</th><th>Notes</th></tr></thead>
            <tbody>
              {filteredClock.length ? filteredClock.map(r => (
                <tr key={r.id}>
                  <td className="td-name">{r.userName}</td>
                  <td className="td-mono" style={{ fontSize: 12 }}>{new Date(r.clockIn).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="td-mono" style={{ fontSize: 12 }}>{r.clockOut ? new Date(r.clockOut).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="td-mono" style={{ fontWeight: 600 }}>{r.totalHours != null ? r.totalHours.toFixed(1) + ' h' : '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--text3)' }}>{r.notes || '—'}</td>
                </tr>
              )) : <tr><td colSpan={5}><div className="empty-state"><div className="empty-title">No records in range</div></div></td></tr>}
            </tbody>
          </table></div></div>
        </>
      )}
    </div>
  )
}

// ── SUPER ADMIN ──
function SuperAdminPage({ featureFlags, setFeatureFlags, appUsers }) {
  const PAGE_LABELS = {
    dashboard: 'Dashboard', inventory: 'Inventory', checkinout: 'Stock Log',
    'tools-cio': 'Check-In/Out', orders: 'Orders', soa: 'SOA',
    services: 'Services', customers: 'Customers', vendors: 'Vendors',
    users: 'Users', expenses: 'Expenses', reports: 'Reports', clock: 'Clock In/Out'
  }
  const WIDGET_LABELS = {
    financialValues: 'Financial Values (Revenue, Profit, Costs)',
    stockValue: 'Inventory Stock Value',
    avgPriceWidget: 'Average Price Widget (Services)',
    customerStatus: 'Customer Status Column',
    capacityWidget: 'Production Capacity Widget',
    expensesWidget: 'Expenses Card on Dashboard',
  }
  const ROLE_COUNTS = {}
  appUsers.forEach(u => { ROLE_COUNTS[u.role] = (ROLE_COUNTS[u.role] || 0) + 1 })

  function togglePage(pageId) {
    setFeatureFlags(f => ({ ...f, pages: { ...f.pages, [pageId]: !f.pages[pageId] } }))
  }
  function toggleWidget(key) {
    setFeatureFlags(f => ({ ...f, widgets: { ...f.widgets, [key]: !f.widgets[key] } }))
  }

  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">System Settings</div><div className="section-sub">Super Admin controls — page visibility &amp; widget toggles</div></div>
      </div>

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-val accent">{appUsers.length}</div></div>
        {Object.entries(ROLE_COUNTS).map(([role, count]) => (
          <div key={role} className="stat-card"><div className="stat-label">{role.charAt(0).toUpperCase() + role.slice(1)}s</div><div className="stat-val">{count}</div></div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 16 }}>
        {/* Page Visibility */}
        <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Page Visibility</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Toggle which pages are visible to non-super-admin users</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(PAGE_LABELS).map(([id, label]) => {
              const enabled = featureFlags.pages[id] !== false
              return (
                <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: enabled ? 'var(--text1)' : 'var(--text3)' }}>{label}</span>
                  <button onClick={() => togglePage(id)}
                    style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'background .2s', background: enabled ? 'var(--blue)' : 'var(--dark2)', position: 'relative' }}>
                    <span style={{ position: 'absolute', top: 3, left: enabled ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', display: 'block' }} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {/* Widget Visibility */}
        <div style={{ background: 'var(--dark3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Widget Visibility</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>Control which data widgets are shown to non-admin users</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {Object.entries(WIDGET_LABELS).map(([key, label]) => {
              const enabled = featureFlags.widgets[key] !== false
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontSize: 13, color: enabled ? 'var(--text1)' : 'var(--text3)', flex: 1 }}>{label}</span>
                  <button onClick={() => toggleWidget(key)}
                    style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', transition: 'background .2s', background: enabled ? 'var(--blue)' : 'var(--dark2)', position: 'relative', flexShrink: 0 }}>
                    <span style={{ position: 'absolute', top: 3, left: enabled ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .2s', display: 'block' }} />
                  </button>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 16, padding: '10px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: '#ef4444' }}>
            Financial data visibility affects: Revenue, Profit, Stock Value, Order Totals. Disabling prevents these values from appearing for non-admin roles.
          </div>
        </div>
      </div>
    </div>
  )
}

// ── USERS ──
function UsersPage({ appUsers, currentUser, isAdmin, onAdd, onEdit, onDelete }) {
  if (!isAdmin) return <div className="page"><div className="empty-state"><div className="empty-title">Admin access required</div></div></div>
  return (
    <div className="page">
      <div className="section-header">
        <div><div className="section-title">Users</div><div className="section-sub">Staff accounts &amp; access</div></div>
        <button className="btn btn-primary" onClick={onAdd}>+ Add User</button>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total Staff</div><div className="stat-val accent">{appUsers.length}</div></div>
        <div className="stat-card"><div className="stat-label">Admins</div><div className="stat-val">{appUsers.filter(u => u.role === 'admin').length}</div></div>
        <div className="stat-card"><div className="stat-label">Active</div><div className="stat-val green">{appUsers.filter(u => u.status === 'Active').length}</div></div>
      </div>
      <div className="table-card"><div className="table-scroll"><table>
        <thead><tr><th>Name</th><th>Username</th><th>Role</th><th>Last Login</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {appUsers.map(u => (
            <tr key={u.id}>
              <td><div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><div className="user-table-avatar" style={{ background: avColor(u.name) }}>{initials(u.name)}</div><span className="td-name">{u.name}</span></div></td>
              <td className="td-mono">{u.username}</td>
              <td><span className={`badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'assistant' ? 'badge-blue' : u.role === 'operator' ? 'badge-warn' : 'badge-gray'}`}>{u.role.charAt(0).toUpperCase() + u.role.slice(1)}</span></td>
              <td style={{ fontSize: 12, color: 'var(--text2)' }}>{new Date(u.lastLogin).toLocaleString('en-PH')}</td>
              <td><span className={`badge ${u.status === 'Active' ? 'badge-green' : 'badge-red'}`}>{u.status}</span></td>
              <td><div className="td-actions"><button className="btn-icon" onClick={() => onEdit(u.id)}>Edit</button>{u.id !== currentUser.id && <button className="btn-icon" style={{ color: '#ef4444' }} onClick={() => onDelete(u.id)}>Del</button>}</div></td>
            </tr>
          ))}
        </tbody>
      </table></div></div>
    </div>
  )
}
