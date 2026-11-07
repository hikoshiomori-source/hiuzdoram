LABORATORY 2 — BROKEN BUILDS OF THE TODO APPLICATION
====================================================

Six builds. Each is the same application as todo.html with exactly ONE rule
broken. Nothing else differs between them.

HOW TO USE THEM
  1. Run your suite against the clean todo.html first. All six green.
  2. Open BaseTest.java and change APP_URL to point at one of these builds.
  3. Run the suite WITHOUT opening the application. Write down which tests
     went red and which stayed green.
  4. Only then open the build by hand and work out what it actually does.

Change nothing except APP_URL. If you edit a test so that it passes, you have
destroyed the evidence you came here to collect.

Start at the build matching your pair number, then work forward through the
letters, wrapping round from F back to A. Three builds minimum.

A defect your suite misses is not the build's fault. It means that rule was
never really being checked. Write the test that would have caught it, and
prove it: red against that build, green against the clean one.
