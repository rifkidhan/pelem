<script lang="ts">
	import { Card, Image, YTEmbed } from "$lib/components";

	const test = {
		id: 5469115,
		name: "Goodbye, Mrs. Selvig",
		overview:
			"Outie Mark contemplates the meaning of a message. Lumon grapples with the fallout of the Overtime Contingency.",
		vote_average: 0,
		vote_count: 0,
		air_date: "2025-01-23",
		episode_number: 2,
		episode_type: "standard",
		production_code: "",
		runtime: 47,
		season_number: 2,
		show_id: 95396,
		still_path: "/wjlSkqMoLngSO6fv2Ajt2CIeCSi.jpg"
	};
</script>

<main>
	<h1>Movies</h1>
	<div>
		<Image alt="test" />
	</div>
	<YTEmbed videoKey="kAw4PH2IQgo" />
	<YTEmbed videoKey="LE6B984GXJk" />
	<Card img={test.still_path} img_type="still" title={test.name} />
</main>

<style>
	div {
		width: 300px;
		height: fit-content;
	}
</style>
