import { useRequireRole } from "@/hooks/useRequireRole";
import { UserRole } from "@/api/types/user.types";
import AdminLayout from "@/components/admin/AdminLayout";

export default function PageAdmin() {
	const allowed = useRequireRole([UserRole.admin, UserRole.moderator]);
	if (!allowed) return null;
	return <AdminLayout />;
}
