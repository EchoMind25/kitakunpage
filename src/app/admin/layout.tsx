import { AdminLayout } from "@/components/admin/AdminLayout";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV !== "development") {
    return (
      <html lang="en">
        <body>
          <div style={{ padding: 40, fontFamily: "monospace", color: "#999" }}>
            <h1 style={{ color: "#e55" }}>403 Forbidden</h1>
            <p>Admin panel is only available in development mode.</p>
          </div>
        </body>
      </html>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}
