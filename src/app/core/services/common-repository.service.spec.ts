import { TestBed } from '@angular/core/testing';

import { CommonRepositoryService } from './common-repository.service';
import { of, throwError } from 'rxjs';
import { Album } from '../../main/album/interface/album.interface';
import { Photo } from '../../main/photos/interface/photos.interface';
import { Post } from '../../main/posts/interface/post.interface';
import { CommonApiService } from './common-api.service';


describe('CommonRepositoryService', () => {
  let service: CommonRepositoryService;
  let mockApiService: jasmine.SpyObj<CommonApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('CommonApiService', [
      'getPhotos',
      'getPosts',
      'getAlbums',
      'getPhotoDetail',
      'getPostDetail',
    ]);

    TestBed.configureTestingModule({
      providers: [
        CommonRepositoryService,
        { provide: CommonApiService, useValue: apiServiceSpy },
      ],
    });

    service = TestBed.inject(CommonRepositoryService);
    mockApiService = TestBed.inject(
      CommonApiService
    ) as jasmine.SpyObj<CommonApiService>;
  });

  afterEach(() => {
    service.photosRefresh();
    service.postsRefresh();
    service.albumsRefresh();
  });

  describe('getPhotos', () => {
    it('should return cached photos if available', (done: DoneFn) => {
      const mockPhotos: Photo[] = [{ id: 1, title: 'Photo 1', url: '', thumbnailUrl: '', albumId: 1 }];
      service['cachedPhotos'] = new Set(mockPhotos);

      service.getPhotos({ _start: 0, _limit: 10 }).subscribe((photos) => {
        expect(photos).toEqual(mockPhotos);
        done();
      });
    });

    it('should fetch photos from API if cache is empty', (done: DoneFn) => {
      const mockPhotos: Photo[] = [{ id: 1, title: 'Photo 1', url: '', thumbnailUrl: '', albumId: 1 }];
      mockApiService.getPhotos.and.returnValue(of(mockPhotos));

      service.getPhotos({ _start: 0, _limit: 10 }).subscribe((photos) => {
        expect(photos).toEqual(mockPhotos);
        expect(mockApiService.getPhotos).toHaveBeenCalledOnceWith({ _start: 0, _limit: 10 });
        done();
      });
    });

    it('should handle API errors and return an empty array', (done: DoneFn) => {
      mockApiService.getPhotos.and.returnValue(throwError(() => new Error('API error')));

      service.getPhotos({ _start: 0, _limit: 10 }).subscribe((photos) => {
        expect(photos).toEqual([]);
        done();
      });
    });
  });

  describe('getPosts', () => {
    it('should return cached posts if available', (done: DoneFn) => {
      const mockPosts: Post[] = [{ id: 1, title: 'Post 1', body: '', userId: 1 }];
      service['cachedPosts'] = new Set(mockPosts);

      service.getPosts({ _start: 0, _limit: 10 }).subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
        done();
      });
    });

    it('should fetch posts from API if cache is empty', (done: DoneFn) => {
      const mockPosts: Post[] = [{ id: 1, title: 'Post 1', body: '', userId: 1 }];
      mockApiService.getPosts.and.returnValue(of(mockPosts));

      service.getPosts({ _start: 0, _limit: 10 }).subscribe((posts) => {
        expect(posts).toEqual(mockPosts);
        expect(mockApiService.getPosts).toHaveBeenCalledOnceWith({ _start: 0, _limit: 10 });
        done();
      });
    });

    it('should handle API errors and return an empty array', (done: DoneFn) => {
      mockApiService.getPosts.and.returnValue(throwError(() => new Error('API error')));

      service.getPosts({ _start: 0, _limit: 10 }).subscribe((posts) => {
        expect(posts).toEqual([]);
        done();
      });
    });
  });

  describe('getPhotoDetail', () => {
    it('should return cached photo detail if available', (done: DoneFn) => {
      const mockPhoto: Photo = { id: 1, title: 'Photo 1', url: '', thumbnailUrl: '', albumId: 1 };
      service['cachedPhotosWithId'].set('1', mockPhoto);

      service.getPhotoDetail('1').subscribe((photo) => {
        expect(photo).toEqual(mockPhoto);
        done();
      });
    });

    it('should fetch photo detail from API if not cached', (done: DoneFn) => {
      const mockPhoto: Photo = { id: 1, title: 'Photo 1', url: '', thumbnailUrl: '', albumId: 1 };
      mockApiService.getPhotoDetail.and.returnValue(of(mockPhoto));

      service.getPhotoDetail('1').subscribe((photo) => {
        expect(photo).toEqual(mockPhoto);
        expect(mockApiService.getPhotoDetail).toHaveBeenCalledOnceWith('1');
        done();
      });
    });

    it('should handle API errors and return null', (done: DoneFn) => {
      mockApiService.getPhotoDetail.and.returnValue(throwError(() => new Error('API error')));

      service.getPhotoDetail('1').subscribe((photo) => {
        expect(photo).toBeNull();
        done();
      });
    });
  });

  describe('postsRefresh', () => {
    it('should clear cached posts', () => {
      const mockPosts: Post[] = [{ id: 1, title: 'Post 1', body: '', userId: 1 }];
      service['cachedPosts'] = new Set(mockPosts);

      service.postsRefresh();

      expect(service['cachedPosts'].size).toBe(0);
    });
  });

  describe('albumsRefresh', () => {
    it('should clear cached albums', () => {
      const mockAlbums: Album[] = [{ id: 1, title: 'Album 1', userId: 1 }];
      service['cachedAlbums'] = new Set(mockAlbums);

      service.albumsRefresh();

      expect(service['cachedAlbums'].size).toBe(0);
    });
  });

  describe('photosRefresh', () => {
    it('should clear cached photos', () => {
      const mockPhotos: Photo[] = [{ id: 1, title: 'Photo 1', url: '', thumbnailUrl: '', albumId: 1 }];
      service['cachedPhotos'] = new Set(mockPhotos);

      service.photosRefresh();

      expect(service['cachedPhotos'].size).toBe(0);
    });
  });
});
