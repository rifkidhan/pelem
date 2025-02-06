export const formatCurrency = (amount: number) => {
	const currency = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD"
	});

	return currency.format(amount);
};

export const formatRuntime = (time: number) => {
	const hour = Math.floor(time / 60);
	const minute = Math.floor(time % 60);

	return `${hour > 0 ? hour + "h " : ""}${minute > 0 ? minute + "min" : ""}`;
};

export const formatDate = (time: string) => {
	const date = new Date(time);
	const dateTime = new Intl.DateTimeFormat("en-US", {
		dateStyle: "long"
	});

	return dateTime.format(date);
};

export const getYear = (time: string) => {
	const date = new Date(time);

	return date.getFullYear();
};

export const formatCountryName = (name: string) => {
	const displayName = new Intl.DisplayNames(["en"], {
		type: "region"
	});

	return displayName.of(name);
};

export const formatLanguage = (lang: string) => {
	const language = new Intl.DisplayNames(["en"], {
		type: "language"
	});

	return language.of(lang);
};

export const formatPlural = () => {
	const cardinalNumber = new Intl.PluralRules("en-US").select(2);
	return cardinalNumber;
};
