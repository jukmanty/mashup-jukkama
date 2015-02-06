# Best gasoline price mashup

## Problem description

As a private motorist I want easily to

* Find best current gasoline/diesel price in local stations on my route from work to home
* Estimate if gasoline/diesel price will fall or rise in the near future

## Requirements

* Designed for one user (me) private use only, station list etc. configuration can be done offline
* Best current price and place must be found without excessive navigation
* Mobile support, one uses this app on the road
* Price graphs for estimating what might happen to station price in the near future
** automatic analysis not required at the moment
** gasoline/diesel (local) price graphs 
** crude oil price changes (global)

## Data sources

* Any public website that collects local gasoline prices and allows private use of the data
** If html is only public format then extract price data out of it
*** If possible make it configurable (page urls, xpaths etc.)
* Public information about crude oil price changes, Bloomberg, Yahoo, Google, some other market data provider
** Hopefully there are some sort of free APIs available
