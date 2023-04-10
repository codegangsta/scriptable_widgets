const path = FileManager.local().bookmarkedPath("Notes")

const fmt = new DateFormatter()
fmt.dateFormat = 'yyyy-MM-dd'
const formattedDate = fmt.string(new Date())
const filePath = path + `/Diary/${formattedDate}.md`

const widget = new ListWidget()
const nextRefresh = Date.now() + 1000 * 30
widget.refreshAfterDate = new Date(nextRefresh)
widget.spacing = 8

// Add Title
const title = widget.addText("Today")
title.font = Font.blackMonospacedSystemFont(18)
widget.addSpacer(8)

if (FileManager.local().fileExists(filePath)) {
  const contents = FileManager.local().readString(filePath)

  const uncompletedTodos = contents
    .split('\n')
    .filter(line => line.startsWith('- [ ]'))
    .map(line => "☐ " + line.slice(6));

  const removeLinks = str => str.replace(/\[\[(.*?)\]\]/g, '$1').replace(/\[(.*?)]\(.*?\)/g, '$1');

  // Remove tags (tokens that start with #)
  const removeTags = str => str.replace(/#[^\s]+/g, '');

  // Apply both functions to each line of uncompleted todos
  const processedTodos = uncompletedTodos.map(todo => removeTags(removeLinks(todo)));

  if (processedTodos.length > 0) {
    processedTodos.forEach(t => {
      const text = widget.addText(t)
      text.lineLimit = 1
      text.url = "obsidian://advanced-uri?vault=Notes&commandid=daily-notes"
    })
    widget.addSpacer()
  } else {
    const text = widget.addText("No more tasks today!")
    text.font = Font.boldMonospacedSystemFont(16)
  }
} else {
  const text = widget.addText("No daily note exists. Tap to create one.")
  text.font = Font.boldMonospacedSystemFont(16)
}

const stack = widget.addStack()
stack.addSpacer()

const addButton = stack.addText("+")
addButton.font = Font.boldMonospacedSystemFont(32)
addButton.url = "obsidian://advanced-uri?vault=Notes&commandid=quickadd%253Achoice%253A6bbad5c2-5846-4cb9-ad3a-3151327ea8c8"

widget.presentLarge()

Script.setWidget(widget)
