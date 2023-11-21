import { Picker } from "emoji-mart";
new Picker({
  data: async () => {
    const response = await fetch("https://cdn.jsdelivr.net/npm/@emoji-mart/data");

    return response.json();
  },
});
