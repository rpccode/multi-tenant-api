export const tablesByPublicSchema = () => [
  `
  CREATE TABLE IF NOT EXISTS admin.tenant (
    id UUID PRIMARY KEY uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    superUser UUID NOT NULL,
    lastSync TIMESTAMPTZ(6) NOT NULL,
    lastSyncError TIMESTAMPTZ(6) NOT NULL,
    createdAt TIMESTAMPTZ(6) NOT NULL,
    updatedAt TIMESTAMPTZ(6) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tenant_name ON admin.tenant(name);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.payment_method (
    id SERIAL PRIMARY KEY,
    payment_method VARCHAR(50) NOT NULL UNIQUE
  );
  CREATE INDEX IF NOT EXISTS idx_metodo_pago ON admin.payment_method(payment_method);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.plans (
    plan_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL,
    interval VARCHAR(50) NOT NULL,
    trial_period_days INTEGER DEFAULT 0,
    max_subscriptions INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_plans_name ON admin.plans(name);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    plan_id INT NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'activa',
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id),
    FOREIGN KEY (plan_id) REFERENCES admin.plans(plan_id)
  );
  CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant_id ON admin.subscriptions(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON admin.subscriptions(plan_id);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.subscription_history (
    history_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    subscription_id INT NOT NULL,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    change_type VARCHAR(50) NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id),
    FOREIGN KEY (subscription_id) REFERENCES admin.subscriptions(subscription_id)
  );
  CREATE INDEX IF NOT EXISTS idx_subscription_history_tenant_id ON admin.subscription_history(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_subscription_history_subscription_id ON admin.subscription_history(subscription_id);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.payments (
    payment_id SERIAL PRIMARY KEY,
    subscription_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50) NOT NULL,
    FOREIGN KEY (subscription_id) REFERENCES admin.subscriptions(subscription_id)
  );
  CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON admin.payments(subscription_id);
  CREATE INDEX IF NOT EXISTS idx_payments_payment_method ON admin.payments(payment_method);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.notifications (
    notification_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON admin.notifications(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_notification_type ON admin.notifications(notification_type);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.coupons (
    coupon_id SERIAL PRIMARY KEY,
    code VARCHAR(255) UNIQUE NOT NULL,
    discount_amount DECIMAL(10, 2),
    discount_percentage DECIMAL(5, 2),
    expiration_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'activo'
  );
  CREATE INDEX IF NOT EXISTS idx_coupons_code ON admin.coupons(code);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.coupon_usage (
    usage_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    coupon_id INT NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id),
    FOREIGN KEY (coupon_id) REFERENCES admin.coupons(coupon_id)
  );
  CREATE INDEX IF NOT EXISTS idx_coupon_usage_tenant_id ON admin.coupon_usage(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_id ON admin.coupon_usage(coupon_id);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.user_activity (
    activity_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_user_activity_tenant_id ON admin.user_activity(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_user_activity_activity_type ON admin.user_activity(activity_type);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.error_logs (
    log_id SERIAL PRIMARY KEY,
    error_message TEXT NOT NULL,
    error_code VARCHAR(50),
    tenant_id UUID,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context TEXT,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_error_logs_tenant_id ON admin.error_logs(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_error_logs_error_code ON admin.error_logs(error_code);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.devices (
    device_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    device_token TEXT NOT NULL,
    last_login TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_devices_tenant_id ON admin.devices(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_devices_device_type ON admin.devices(device_type);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.data_activity_logs (
    log_id SERIAL PRIMARY KEY,
    tenant_id UUID,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_data_activity_logs_tenant_id ON admin.data_activity_logs(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_data_activity_logs_activity_type ON admin.data_activity_logs(activity_type);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.password_history (
    history_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    password_hash TEXT NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_password_history_tenant_id ON admin.password_history(tenant_id);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.mfa (
    mfa_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    mfa_type VARCHAR(50) NOT NULL,
    mfa_secret TEXT NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    last_verified TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_mfa_tenant_id ON admin.mfa(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_mfa_mfa_type ON admin.mfa(mfa_type);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.password_reset_tokens (
    reset_token_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    reset_token TEXT NOT NULL UNIQUE,
    expiration_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_tenant_id ON admin.password_reset_tokens(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_reset_token ON admin.password_reset_tokens(reset_token);
  `,
  `
  CREATE TABLE IF NOT EXISTS admin.session_tokens (
    token_id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expiration_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES admin.tenant(id)
  );
  CREATE INDEX IF NOT EXISTS idx_session_tokens_tenant_id ON admin.session_tokens(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_session_tokens_token ON admin.session_tokens(token);
  `
];

export const tables = (tenantName: string): Array<string> => [
  `
  CREATE TABLE IF NOT EXISTS "${tenantName}".roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    "state" BOOL DEFAULT true
  );
  CREATE INDEX IF NOT EXISTS idx_roles_name ON "${tenantName}".roles(name);
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}".permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_permissions_name ON "${tenantName}".permissions(name);
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}".role_permissions (
    roleId INT NOT NULL,
    permissionId INT NOT NULL,
    FOREIGN KEY (roleId) REFERENCES "${tenantName}".roles(id),
    FOREIGN KEY (permissionId) REFERENCES "${tenantName}".permissions(id),
    PRIMARY KEY (roleId, permissionId)
  );
  CREATE INDEX IF NOT EXISTS idx_role_permissions_roleId ON "${tenantName}".role_permissions(roleId);
  CREATE INDEX IF NOT EXISTS idx_role_permissions_permissionId ON "${tenantName}".role_permissions(permissionId);
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}".users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL unique,
    email VARCHAR(50) NOT NULL unique,
    password VARCHAR(255) NOT NULL,
    roleId INT,
    CONSTRAINT fk_role FOREIGN KEY(roleId) REFERENCES "${tenantName}".roles(id)
  );
  CREATE INDEX IF NOT EXISTS idx_users_username ON "${tenantName}".users(username);
  CREATE INDEX IF NOT EXISTS idx_users_email ON "${tenantName}".users(email);
  CREATE INDEX IF NOT EXISTS idx_users_roleId ON "${tenantName}".users(roleId);
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."Frequency" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(20) COLLATE "pg_catalog"."default" NOT NULL,
    "fnumber" INT4 NOT NULL,
    "state" BOOL DEFAULT true
  );
  CREATE INDEX IF NOT EXISTS idx_Frequency_name ON "${tenantName}"."Frequency"("name");
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."Person" (
    "id" SERIAL PRIMARY KEY,
    "personType_id" INT4 NOT NULL,
    "typeDni" VARCHAR(10) COLLATE "pg_catalog"."default" NOT NULL,
    "dni" VARCHAR(20) COLLATE "pg_catalog"."default",
    "first_name" VARCHAR(100) COLLATE "pg_catalog"."default" NOT NULL,
    "last_name" VARCHAR(100) COLLATE "pg_catalog"."default" NOT NULL,
    "address" INT4,
    "telefono" VARCHAR(20) COLLATE "pg_catalog"."default" NOT NULL,
    "email" VARCHAR(50) COLLATE "pg_catalog"."default" NOT NULL,
    "position" INT4,
    "state" BOOL DEFAULT true
  );
  CREATE INDEX IF NOT EXISTS idx_Person_personType_id ON "${tenantName}"."Person"("personType_id");
  CREATE INDEX IF NOT EXISTS idx_Person_email ON "${tenantName}"."Person"("email");
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."LoanState" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(20) COLLATE "pg_catalog"."default" NOT NULL,
    "state" BOOL DEFAULT true
  );
  CREATE INDEX IF NOT EXISTS idx_LoanState_name ON "${tenantName}"."LoanState"("name");
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."LoanHeader" (
    "id" SERIAL PRIMARY KEY,
    "user_id" UUID NOT NULL,
    "person_id" INT4 NOT NULL,
    "frequency_id" INT4 NOT NULL,
    "loan_num" VARCHAR(100) NOT NULL,
    "amount" FLOAT8 NOT NULL,
    "dues" INT4 NOT NULL,
    "interest" FLOAT8 NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "state_id" INT4 NOT NULL,
    FOREIGN KEY ("person_id") REFERENCES "${tenantName}"."Person" ("id"),
    FOREIGN KEY ("frequency_id") REFERENCES "${tenantName}"."Frequency" ("id"),
    FOREIGN KEY ("state_id") REFERENCES "${tenantName}"."LoanState" ("id")
  );
  CREATE INDEX IF NOT EXISTS idx_LoanHeader_user_id ON "${tenantName}"."LoanHeader"("user_id");
  CREATE INDEX IF NOT EXISTS idx_LoanHeader_person_id ON "${tenantName}"."LoanHeader"("person_id");
  CREATE INDEX IF NOT EXISTS idx_LoanHeader_frequency_id ON "${tenantName}"."LoanHeader"("frequency_id");
  CREATE INDEX IF NOT EXISTS idx_LoanHeader_state_id ON "${tenantName}"."LoanHeader"("state_id");
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."LoanDetail" (
    "id" SERIAL PRIMARY KEY,
    "loan_id" INT4 NOT NULL,
    "dues_num" INT4 NOT NULL,
    "dues_amount" FLOAT8 NOT NULL,
    "total_amount" FLOAT8 NOT NULL,
    "total_interest" FLOAT8 NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "state_id" INT4 NOT NULL,
    FOREIGN KEY ("loan_id") REFERENCES "${tenantName}"."LoanHeader" ("id"),
    FOREIGN KEY ("state_id") REFERENCES "${tenantName}"."LoanState" ("id")
  );
  CREATE INDEX IF NOT EXISTS idx_LoanDetail_loan_id ON "${tenantName}"."LoanDetail"("loan_id");
  CREATE INDEX IF NOT EXISTS idx_LoanDetail_state_id ON "${tenantName}"."LoanDetail"("state_id");
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."Payment" (
    "id" SERIAL PRIMARY KEY,
    "loan_id" INT4 NOT NULL,
    "user_id" UUID NOT NULL,
    "payment_number" INT4,
    "balance" FLOAT8 NOT NULL,
    "capital" FLOAT8 NOT NULL,
    "interest" FLOAT8 NOT NULL,
    "dues" FLOAT8 NOT NULL,
    "payment_amount" FLOAT8 NOT NULL,
    "state_id" INT4 NOT NULL,
    FOREIGN KEY ("loan_id") REFERENCES "${tenantName}"."LoanHeader" ("id"),
    FOREIGN KEY ("state_id") REFERENCES "${tenantName}"."LoanState" ("id")
  );
  CREATE INDEX IF NOT EXISTS idx_Payment_loan_id ON "${tenantName}"."Payment"("loan_id");
  CREATE INDEX IF NOT EXISTS idx_Payment_user_id ON "${tenantName}"."Payment"("user_id");
  CREATE INDEX IF NOT EXISTS idx_Payment_state_id ON "${tenantName}"."Payment"("state_id");
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."GeneralConfiguration" (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL,
    config_value VARCHAR(255) NOT NULL,
    description VARCHAR(255)
  );
  CREATE INDEX IF NOT EXISTS idx_GeneralConfiguration_config_name ON "${tenantName}"."GeneralConfiguration"(config_name);
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."LoanConfiguration" (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL,
    config_value VARCHAR(255) NOT NULL,
    description VARCHAR(255)
  );
  CREATE INDEX IF NOT EXISTS idx_LoanConfiguration_config_name ON "${tenantName}"."LoanConfiguration"(config_name);
  `,

  `
  CREATE TABLE IF NOT EXISTS "${tenantName}"."AppConfiguration" (
    id SERIAL PRIMARY KEY,
    config_name VARCHAR(100) NOT NULL,
    config_value VARCHAR(255) NOT NULL,
    description VARCHAR(255)
  );
  CREATE INDEX IF NOT EXISTS idx_AppConfiguration_config_name ON "${tenantName}"."AppConfiguration"(config_name);
  `,
];
