# Integrating Jeopardy and DuckDuckGo's InstantAnswers

![The Jeopardy board](https://upload.wikimedia.org/wikipedia/commons/d/d8/Jeopardy_game_board.png)

### :warning: Read the submission guidelines at the bottom of this page first.

1. Read [DuckDuckGo's Instant Answer API](https://duckduckgo.com/api) requirements.
2. Perform a GET request, having changed the `q` query parameter in their API URI to search for more information on the correct Jeopardy answer. Their API URI is: `https://api.duckduckgo.com/?q=REPLACEME&format=json&pretty=1`.
3. Because we're passing an answer string through the URI (as a query parameter), and the answer string might contain characters which are accidentally meaningful in URIs (like an ampersand), and therefore could break our request, let's play it safe and encode the string first using [`encodeURI()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI). *(2 points)*
4. On a guess, display at least one valid "InstantAnswer" value (if any) from your DuckDuckGo request. Don't choose randomly. Identify useful properties in the hydrated InstantAnswer object, then check to see if any of those have content. *(5 points)*
5. As DuckDuckGo instructs, attribute DuckDuckGo in your page and use a descriptive `t` parameter. *(required)*
6. Refactor your Jeopardy app to use your Grid and Cell classes, and to be organized in terms of categories and difficulty values (dollar values), just like in the real game. *(5 points)*
7. When retrieving Jeopardy questions, validate that neither the question nor the answer are empty and that they don't contain HTML artifacts. If they are invalid, skip and find another. It's easier than trying to remove the HTML. You can use this RegEx function to test for HTML tags and HTML entities: `const containsHTML = text => /(<.+?>)|(&.{1,6}?;)/.test(text);`. *(2 points)*
8. Notice that jService accepts feedback from users to increment an "invalid_count" property on their questions. (They have an `/api/invalid?id=` endpoint just for this reporting, which we're not going to use.) Anything with an `invalid_count` should be skipped, too. *(1 point)*
9. Escaped characters (e.g. `\"`) are easy to deal with, so just remove the slash from these strings. *(2 points)*

# Submission Guidelines
1. Fork this repo and clone it to your machine.
2. Enable GitHub Pages for your repo.
3. Add your code, per the instructions above.
4. Push your completed code to your own repo.
5. Submit a pull request to the *original* repo.
6. On the PR, add a comment with a link to your GitHub Page for your project.
7. On Canvas, submit a link to your PR.
