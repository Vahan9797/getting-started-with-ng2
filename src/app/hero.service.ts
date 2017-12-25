import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  constructor(
  	private http: HttpClient,
  	private messageService: MessageService
  ) { }

  private log(message: string) {
  	this.messageService.add('HeroService' + message);
  }

  private heroesUrl = 'api/heroes'; // URL to web api

  getHeroes(): Observable<Hero[]> {
  	this.messageService.add('HeroService: fetched heroes');
  	return this.http.get<Hero[]>(this.heroesUrl)
  		.pipe(
  			catchError(this.handleError('getHeroes', []))
  		);
  }

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
	  return (error: any): Observable<T> => {

	    // TODO: send the error to remote logging infrastructure
	    console.error(error); // log to console instead

	    // TODO: better job of transforming error for user consumption
	    this.log(`${operation} failed: ${error.message}`);

	    // Let the app keep running by returning an empty result.
	    return of(result as T);
	  };
	}

	getHero(id: number): Observable<Hero> {
	  // Todo: send the message _after_ fetching the hero
	  this.messageService.add(`HeroService: fetched hero id=${id}`);
	  return of(HEROES.find(hero => hero.id === id));
	}

		/** PUT: update the hero on the server */
	updateHero (hero: Hero): Observable<any> {
	  return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
	    tap(_ => this.log(`updated hero id=${hero.id}`)),
	    catchError(this.handleError<any>('updateHero'))
	  );
	}

	/** DELETE: delete the hero from the server */
	deleteHero (hero: Hero | number): Observable<Hero> {
	  const id = typeof hero === 'number' ? hero : hero.id;
	  const url = `${this.heroesUrl}/${id}`;

	  return this.http.delete<Hero>(url, httpOptions).pipe(
	    tap(_ => this.log(`deleted hero id=${id}`)),
	    catchError(this.handleError<Hero>('deleteHero'))
	  );
	}
}
