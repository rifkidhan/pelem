export default function isNull(item?: unknown) {
	if (typeof item === "undefined") return true;

	if (typeof item === "string" && item == "") return true;

	if (typeof item === "number" && item == 0) return true;

	if (Array.isArray(item) && item.length == 0) return true;

	return false;
}
