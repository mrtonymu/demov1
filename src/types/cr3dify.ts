// CR3DIFY 业务类型定义

// 客户信息
export interface Client {
  id: string
  full_name: string
  ic_number: string
  phone: string
  email: string
  address: string
  status: 'active' | 'inactive' | 'suspended'
  created_at: string
  updated_at?: string
}

// 贷款信息
export interface Loan {
  id: string
  client_id: string
  principal: number // 本金
  disbursed: number // 到手金额
  principal_balance: number // 本金余额
  interest_balance: number // 利息余额
  deposit_amount: number // 押金金额
  deposit_policy: 'none' | 'offset_last' | 'offset_first' // 押金策略
  status: 'normal' | 'settled' | 'negotiating' | 'bad_debt'
  created_at: string
  updated_at?: string

  // 关联客户信息（用于查询时 JOIN）
  client?: Client
}

// 还款交易记录
export interface RepaymentTxn {
  id: string
  loan_id: string
  amount_in: number // 还款金额
  alloc_interest: number // 分配到利息
  alloc_principal: number // 分配到本金
  kind: 'regular' | 'early' | 'partial' | 'settlement' // 还款类型
  created_at: string

  // 还款管理页面使用的属性
  amount: number // 还款金额（别名）
  status: 'pending' | 'completed' | 'overdue' // 还款状态
  due_date?: string // 到期日期
  paid_date?: string // 实际还款日期
  payment_method?: string // 还款方式

  // 关联贷款信息（用于查询时 JOIN）
  loan?: Loan
}

// 用户资料
export interface Profile {
  id: string
  full_name: string
  phone: string
  avatar_url?: string
  created_at: string
  updated_at?: string
}

// 租户信息（多租户支持）
export interface Tenant {
  id: string
  name: string
  status: 'active' | 'inactive'
  created_at: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 查询参数
export interface ClientQuery {
  query?: string // 模糊搜索
  status?: string
  page?: number
  pageSize?: number
}

export interface LoanQuery {
  status?: string
  client_id?: string
  from?: string // 日期范围
  to?: string
  page?: number
  pageSize?: number
}

export interface RepaymentQuery {
  loan_id?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

// 仪表板指标
export interface DashboardMetrics {
  clients: {
    total: number
    active: number
    inactive: number
    blacklisted: number
  }
  loans: {
    total: number
    active: number
    completed: number
    overdue: number
    defaulted: number
    totalAmount: number
    outstandingPrincipal: number
    outstandingInterest: number
  }
  repayments: {
    totalCount: number
    totalAmount: number
    last30Days: {
      count: number
      amount: number
    }
  }
  summary: {
    totalOutstanding: number
    collectionRate: number
    activeLoansCount: number
    overdueLoansCount: number
  }
}

// 贷款状态分布
export interface LoanStatusDistribution {
  status: string
  count: number
  percentage: number
}

// 现金流趋势
export interface CashflowTrend {
  month: string
  disbursed: number
  repaid: number
}

// 即将到期项目
export interface DueSoonItem {
  clientName: string
  dueDate: string
  remainingPrincipal: number
}

// 逾期项目
export interface OverdueItem {
  clientName: string
  overdueDays: number
  balance: number
}

// 最近还款记录
export interface RecentRepayment {
  clientName: string
  amount: number
  time: string
  interestDeduction: number
  principalDeduction: number
}

// 表单数据类型
export interface ClientFormData {
  full_name: string
  ic_number: string
  phone: string
  email: string
  address: string
  status: 'active' | 'inactive' | 'suspended'
}

export interface LoanFormData {
  client_id: string
  principal: number
  disbursed: number
  deposit_amount: number
  deposit_policy: 'none' | 'offset_last' | 'offset_first'
  deduct_interest: boolean
  collect_deposit: boolean
}

export interface RepaymentFormData {
  loan_id: string
  amount_in: number
}

export interface ProfileFormData {
  full_name: string
  phone: string
  avatar_url?: string
}

// 写入保护状态
export interface WriteProtectionStatus {
  writeEnabled: boolean
  message?: string
}

// 审批申请接口
export interface LoanApplication {
  id: string
  client_id: string
  client_name: string
  client_email?: string
  loan_amount: number
  loan_purpose?: string
  interest_rate?: number
  term?: number
  status: 'pending_review' | 'pending_approval' | 'approved' | 'rejected'
  submitted_at: string
  current_step: number
  assigned_to?: string
  documents?: string[]
  created_at: string
  updated_at?: string
}

// 审批操作
export interface ApprovalAction {
  loan_id: string
  action: 'approve' | 'reject'
  comments?: string
}

// 系统配置接口
export interface SystemSettings {
  // 公司信息
  company_name: string
  company_address: string
  phone_number: string
  email_address: string
  business_registration: string
  
  // 贷款设置
  minimum_loan_amount: number
  maximum_loan_amount: number
  default_interest_rate: number
  maximum_loan_term: number
  late_fee_percentage: number
  
  // 通知设置
  email_notifications: boolean
  sms_notifications: boolean
  payment_reminders: boolean
  overdue_alerts: boolean
  system_updates: boolean
  marketing_emails: boolean
  
  // 安全设置
  two_factor_auth: boolean
  session_timeout: boolean
  session_timeout_minutes: number
  
  // 系统状态
  write_enabled: boolean
  demo_mode: boolean
  
  updated_at?: string
  tenant_id?: string
}

// Realtime 事件类型
export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE'

export interface RealtimePayload<T = any> {
  eventType: RealtimeEvent
  new?: T
  old?: T
  errors?: string[]
}

// 贷款状态元数据
export const LOAN_STATUS_META = {
  normal: {
    label: '正常',
    color: 'success' as const,
    bgColor: 'rgba(76, 175, 80, 0.1)'
  },
  settled: {
    label: '已结清',
    color: 'info' as const,
    bgColor: 'rgba(33, 150, 243, 0.1)'
  },
  negotiating: {
    label: '谈账中',
    color: 'warning' as const,
    bgColor: 'rgba(255, 152, 0, 0.1)'
  },
  bad_debt: {
    label: '烂账',
    color: 'error' as const,
    bgColor: 'rgba(244, 67, 54, 0.1)'
  }
} as const

// 客户状态元数据
export const CLIENT_STATUS_META = {
  active: {
    label: '活跃',
    color: 'success' as const
  },
  inactive: {
    label: '非活跃',
    color: 'default' as const
  },
  suspended: {
    label: '暂停',
    color: 'error' as const
  }
} as const

// 还款类型元数据
export const REPAYMENT_KIND_META = {
  regular: {
    label: '正常还款',
    color: 'success' as const
  },
  early: {
    label: '提前还款',
    color: 'info' as const
  },
  partial: {
    label: '部分还款',
    color: 'warning' as const
  },
  settlement: {
    label: '结清',
    color: 'primary' as const
  }
} as const