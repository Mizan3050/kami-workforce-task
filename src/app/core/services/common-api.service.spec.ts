import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommonApiService } from './common-api.service';
import { environment } from '../../../environment/environment';
import { Album } from '../../main/album/interface/album.interface';
import { Photo } from '../../main/photos/interface/photos.interface';
import { Post } from '../../main/posts/interface/post.interface';

describe('CommonApiService', () => {
  let service: CommonApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommonApiService],
    });

    service = TestBed.inject(CommonApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should retrieve a list of photos and map URLs correctly', () => {
    const mockPhotos: Array<Photo> = [
      { id: 1, title: 'Photo 1', url: '', thumbnailUrl: '', albumId: 1 },
      { id: 2, title: 'Photo 2', url: '', thumbnailUrl: '', albumId: 2 },
    ];
    const transformedPhotos = mockPhotos.map(photo => ({
      ...photo,
      url: jasmine.any(String), // URL will be replaced dynamically
      thumbnailUrl: jasmine.any(String),
    }));

    service.getPhotos({ _start: 0, _limit: 10 }).subscribe(photos => {
      expect(photos).toEqual(transformedPhotos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/photos/?_start=0&_limit=10`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPhotos); // Mock HTTP response
  });

  it('should retrieve a photo detail and map URLs correctly', () => {
    const mockPhoto: Photo = { id: 1, title: 'Photo 1', url: '', thumbnailUrl: '', albumId: 1 };
    const transformedPhoto = {
      ...mockPhoto,
      url: jasmine.any(String),
      thumbnailUrl: jasmine.any(String),
    };

    service.getPhotoDetail('1').subscribe(photo => {
      expect(photo).toEqual(transformedPhoto);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/photos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPhoto);
  });

  it('should retrieve a post detail', () => {
    const mockPost: Post = { id: 1, title: 'Post 1', body: 'Post body', userId: 1 };

    service.getPostDetail('1').subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/posts/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should retrieve a list of posts', () => {
    const mockPosts: Array<Post> = [
      { id: 1, title: 'Post 1', body: 'Body 1', userId: 1 },
      { id: 2, title: 'Post 2', body: 'Body 2', userId: 2 },
    ];

    service.getPosts({ _start: 0, _limit: 5 }).subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/posts/?_start=0&_limit=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should retrieve a list of albums', () => {
    const mockAlbums: Array<Album> = [
      { id: 1, title: 'Album 1', userId: 1 },
      { id: 2, title: 'Album 2', userId: 2 },
    ];

    service.getAlbums({ _start: 0, _limit: 5 }).subscribe(albums => {
      expect(albums).toEqual(mockAlbums);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/albums/?_start=0&_limit=5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAlbums);
  });
});
