import { useMemo, useState } from "react";

type Debtor = {
  id: string;
  name: string;
  phone: string;
  balance: number; // net balance (positive means owed)
  totalBorrowCount: number; // frequency of borrowing
};

type DebtEntry = {
  id: string;
  debtorId: string;
  principal: number;
  status: "open" | "partial" | "closed";
  createdAt: string;
};

type Payment = {
  id: string;
  debtId: string;
  amount: number;
  paidAt: string;
};

const mockDebtors: Debtor[] = [
  { id: "d1", name: "Ravi Sharma", phone: "+91 98765 00001", balance: 12000, totalBorrowCount: 5 },
  { id: "d2", name: "Anita Verma", phone: "+91 98765 00002", balance: 8500, totalBorrowCount: 9 },
  { id: "d3", name: "Suresh Kumar", phone: "+91 98765 00003", balance: 1500, totalBorrowCount: 3 },
  { id: "d4", name: "Pooja Iyer", phone: "+91 98765 00004", balance: 21000, totalBorrowCount: 12 },
];

const mockDebts: DebtEntry[] = [
  { id: "db1", debtorId: "d1", principal: 10000, status: "open", createdAt: "2024-05-10" },
  { id: "db2", debtorId: "d1", principal: 2000, status: "partial", createdAt: "2024-05-12" },
  { id: "db3", debtorId: "d2", principal: 8500, status: "open", createdAt: "2024-05-11" },
];

const mockPayments: Payment[] = [
  { id: "p1", debtId: "db2", amount: 500, paidAt: "2024-05-13" },
  { id: "p2", debtId: "db3", amount: 1000, paidAt: "2024-05-14" },
];

function LoginScreen() {
  return (
    <div className="card">
      <h2>Login</h2>
      <input placeholder="Email or phone" />
      <input type="password" placeholder="Password" />
      <button>Sign in</button>
      <p className="muted">Master and managers sign in here.</p>
    </div>
  );
}

function Dashboard({ debtors, onAddDaily, onAddManual }: { debtors: Debtor[]; onAddDaily: () => void; onAddManual: () => void }) {
  const totalOutstanding = debtors.reduce((sum, d) => sum + d.balance, 0);
  const topBalance = [...debtors].sort((a, b) => b.balance - a.balance).slice(0, 5);
  const frequentBorrowers = [...debtors].sort((a, b) => b.totalBorrowCount - a.totalBorrowCount).slice(0, 5);

  return (
    <div className="card">
      <div className="card-header">
        <h2>Dashboard</h2>
        <div className="pill-buttons">
          <button onClick={onAddDaily}>Add daily transaction</button>
          <button className="ghost" onClick={onAddManual}>Manual add single debtor</button>
        </div>
      </div>

      <div className="kpis">
        <div className="kpi">
          <div className="kpi-label">New debt remaining</div>
          <div className="kpi-value">₹ {totalOutstanding.toLocaleString()}</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Debtors</div>
          <div className="kpi-value">{debtors.length}</div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h3>Top balances (desc)</h3>
          <div className="list">
            {topBalance.map((d) => (
              <div key={d.id} className="list-item">
                <div className="title">{d.name}</div>
                <div className="badge">₹ {d.balance.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="col">
          <h3>Frequent borrowers</h3>
          <div className="list">
            {frequentBorrowers.map((d) => (
              <div key={d.id} className="list-item">
                <div className="title">{d.name}</div>
                <div className="badge">{d.totalBorrowCount} times</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DebtorList({ debtors, onSelect }: { debtors: Debtor[]; onSelect: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => debtors.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()) || d.phone.includes(query)),
    [query, debtors]
  );
  return (
    <div className="card">
      <div className="card-header">
        <h2>Debtors</h2>
        <input placeholder="Search name/phone" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="list">
        {filtered.map((d) => (
          <button key={d.id} className="list-item" onClick={() => onSelect(d.id)}>
            <div>
              <div className="title">{d.name}</div>
              <div className="muted">{d.phone}</div>
            </div>
            <div className="badge">₹ {d.balance.toLocaleString()}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DebtorDetail({ debtorId }: { debtorId: string }) {
  const debtor = mockDebtors.find((d) => d.id === debtorId);
  const debts = mockDebts.filter((db) => db.debtorId === debtorId);
  const payments = mockPayments.filter((p) => debts.some((db) => db.id === p.debtId));
  if (!debtor) return null;
  return (
    <div className="card">
      <h2>{debtor.name}</h2>
      <p className="muted">{debtor.phone}</p>
      <div className="row">
        <div className="col">
          <h3>Debts</h3>
          <div className="list">
            {debts.map((db) => (
              <div key={db.id} className="list-item">
                <div>
                  <div className="title">₹ {db.principal.toLocaleString()}</div>
                  <div className="muted">Created {db.createdAt}</div>
                </div>
                <div className={`badge badge-${db.status}`}>{db.status}</div>
              </div>
            ))}
          </div>
          <button className="ghost">+ Add debt</button>
        </div>
        <div className="col">
          <h3>Payments (credit in green)</h3>
          <div className="list">
            {payments.map((p) => (
              <div key={p.id} className="list-item credit">
                <div>
                  <div className="title">₹ {p.amount.toLocaleString()}</div>
                  <div className="muted">Paid {p.paidAt}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="ghost">+ Add payment</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h3>Reminders</h3>
          <p className="muted">Send SMS reminders for due/overdue balances.</p>
          <button>Send SMS now</button>
        </div>
        <div className="col">
          <h3>Daily totals</h3>
          <p className="muted">Managers add daily transactions; master can override.</p>
          <button className="ghost">View today</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedDebtorId, setSelectedDebtorId] = useState<string | null>(mockDebtors[0]?.id ?? null);
  const [activeSidebar, setActiveSidebar] = useState<"dashboard" | "debtors" | "daily">("dashboard");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">Debt Manager</div>
        <div className="muted">Master & Managers</div>
      </header>
      <div className="body">
        <aside className="sidebar">
          <div className="sidebar-title">Menu</div>
          <button className={activeSidebar === "dashboard" ? "sidebar-item active" : "sidebar-item"} onClick={() => setActiveSidebar("dashboard")}>
            Dashboard
          </button>
          <button className={activeSidebar === "debtors" ? "sidebar-item active" : "sidebar-item"} onClick={() => setActiveSidebar("debtors")}>
            Debtors
          </button>
          <button className={activeSidebar === "daily" ? "sidebar-item active" : "sidebar-item"} onClick={() => setActiveSidebar("daily")}>
            Daily transactions
          </button>
        </aside>
        <main className="main">
          {activeSidebar === "dashboard" && (
            <Dashboard
              debtors={mockDebtors}
              onAddDaily={() => setActiveSidebar("daily")}
              onAddManual={() => setActiveSidebar("debtors")}
            />
          )}

          {activeSidebar === "debtors" && (
            <div className="grid">
              <div className="column">
                <DebtorList debtors={mockDebtors} onSelect={setSelectedDebtorId} />
              </div>
              <div className="column">
                {selectedDebtorId ? <DebtorDetail debtorId={selectedDebtorId} /> : <div className="card">Select a debtor</div>}
              </div>
            </div>
          )}

          {activeSidebar === "daily" && (
            <div className="card">
              <div className="card-header">
                <h2>Daily transactions</h2>
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              </div>
              <p className="muted">Select a date, add debt (red) or credit/payment (green), and see totals.</p>

              <div className="quick-add">
                <div className="quick-add-field">
                  <label>Debtor name</label>
                  <input placeholder="e.g., Ravi Sharma" />
                </div>
                <div className="quick-add-field">
                  <label>Amount (₹)</label>
                  <input type="number" placeholder="5000" />
                </div>
                <div className="quick-add-buttons">
                  <button className="debt-btn">Add debt (red)</button>
                  <button className="credit-btn">Add credit/payment (green)</button>
                </div>
              </div>

              <div className="list">
                <div className="list-item debt">
                  <div>
                    <div className="title">Ravi Sharma</div>
                    <div className="muted">Debt added: ₹ 5,000</div>
                  </div>
                  <div className="badge badge-open">Debt</div>
                </div>
                <div className="list-item credit">
                  <div>
                    <div className="title">Anita Verma</div>
                    <div className="muted">Credit/payment: ₹ 2,000</div>
                  </div>
                  <div className="badge badge-closed">Credit</div>
                </div>
              </div>
              <div className="summary">Total debt for {selectedDate}: ₹ 7,000</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
