# Onpoint Test Task

This pixel perfect layout created for Ipad retina display with 1024x768px resolution on pure CSS and JS. The project is written with BEM methodology.

**The main way to interact with this layout is using touch events.** If you want to check how touch events work on your laptop you can configure compatibility mode in Google Chrome browser. You can find out how to do that by this link: *[https://developers.google.com/web/tools/chrome-devtools/device-mode/](https://developers.google.com/web/tools/chrome-devtools/device-mode/)*.

As layout created for Ipad display with certain resoulution it doesn't look good at other devices. On devices with bigger resoulution layout places in the center of the screen and have static width. On devices smaller then Ipad you can scroll the slide if it doesn't fit on the screen fully. Default browser's scroll disabled and all interactions are made with JavaScript(touch events).


# Difficulties
The hardest part of the project is fixing the boundry effect(elastic scroll) in IOS Safari. The problem is that when you try to scroll a slide and this slide doesn't fit entirely on the screen, scroll bars appear and when you try to scroll further than the edge of container, all block will move and white space will be seen in the direction of the swipe. This problem shows every time when you try to make a swipe, all body on the page moves and that looks awful. I haven't found the solution for this problem in css so all scrolls logic made with JS. 

The above problem:
![](https://user-images.githubusercontent.com/44731679/73786312-0f9a3c00-47aa-11ea-9370-482a357c8fc6.gif)

Swipes after problem solving:
![](https://user-images.githubusercontent.com/44731679/73786357-2476cf80-47aa-11ea-8361-55fbdfb1df5d.gif)


# PC support
As you can't trigger swipe events on pc(no touch events), buttons to manipulate page was added. You can acces them if give positive answer in question on the top right angle of the layout.

# Result
Result of the work: *[https://pages.zhurbeysa.xyz](https://pages.zhurbeysa.xyz)*.
