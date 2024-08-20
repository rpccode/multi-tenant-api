export const tableData = (tenantName: string): Array<string> => [
    `
      INSERT INTO "${tenantName}".roles (name) VALUES 
      ('superUser'),
      ('tenant'),
      ('Admin'),
      ('customer'),
      ('guest');
    `,
    `
      INSERT INTO "${tenantName}"."LoanState" (name) VALUES 
      ('Pending'),
      ('Paid'),
      ('Late'),
      ('Partial'),
      ('Under Review'),
      ('Approved'),
      ('Rejected'),
      ('Cancelled'),
      ('In Progress'),
      ('Closed'),
      ('Refunded'),
      ('Defaulted');
    `,
    `
      INSERT INTO "${tenantName}"."Frequency" (name, fnumber) VALUES 
      ('Daily', 1),
      ('Weekly', 7),
      ('Bi-Weekly', 14),
      ('Monthly', 30),
      ('Quarterly', 90),
      ('Semi-Annually', 180),
      ('Annually', 365);
    `,
  ];
  