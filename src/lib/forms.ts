interface FieldIssue {
	message: string;
}

export const getFieldMessage = (
	errors: readonly (FieldIssue | undefined)[] | undefined
): string => {
	const parts: string[] = [];
	for (const error of errors ?? []) {
		if (error) {
			parts.push(error.message);
		}
	}
	return parts.join(", ");
};
