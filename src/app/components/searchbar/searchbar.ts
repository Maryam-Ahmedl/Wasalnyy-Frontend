import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Subject, debounceTime, switchMap } from 'rxjs';
import { LocationSearchService } from '../../services/location-search.service';
import { LocationResult } from '../../models/location-result';

@Component({
  selector: 'app-search-bar',
  templateUrl: 'searchbar.html',
  styleUrl: 'searchbar.css',
})
export class SearchBar implements OnInit {

  @Input() placeholder: string = 'Search location';
  @Output() locationSelected = new EventEmitter<LocationResult>();

  results: LocationResult[] = [];
  private search$ = new Subject<string>();
  constructor(private searchService: LocationSearchService) {}

  ngOnInit() {
    this.search$.pipe(
      debounceTime(500),
      switchMap(query => this.searchService.search(query))
    ).subscribe(res => this.results = res);
  }

  onInput(event: any) {
    const query = event.target.value.trim();
    this.search$.next(query);
  }

  select(result: LocationResult) {
    this.locationSelected.emit(result);
    this.results = [];
  }
}
