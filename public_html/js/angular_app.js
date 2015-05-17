var personneApp = angular.module('personneApp', ['ui.router'])
    .run(function ($rootScope, myUI) {
        $rootScope.myUI = myUI;
    });

personneApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/home'
        })
        .state('liste_personnes', {
            url: '/personnes_liste',
            templateUrl: 'views/listepersonnes',
            controller: 'listePersonnesController',
            resolve: {
                personnes: function($q, WebService) {
                    var deferred = $q.defer();
                    WebService.appel('personnes', function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('liste_personnes.detail', {
            url: '/detail/{id}',
            templateUrl: 'views/detailpersonne',
            controller: 'detailPersonneController',
            resolve: {
                personne: function($q, $stateParams, WebService) {
                    var deferred = $q.defer();
                    WebService.appel('personne/' + $stateParams.id, function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('liste_personnes.create', {
            url: '/create',
            templateUrl: 'views/editpersonne',
            controller: 'editPersonneController'
        })
        .state('liste_personnes.edit', {
            url: '/edit/{id}',
            templateUrl: 'views/editpersonne',
            controller: 'editPersonneController',
            resolve: {
                personne: function($q, $stateParams, WebService) {
                    var deferred = $q.defer();
                    WebService.appel('personne/' + $stateParams.id, function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('liste_personnes.delete', {
            url: '/delete/{id}',
            controller: function($stateParams, $state, WebService) {
                WebService.delete($stateParams.id, function() {
                    $state.go('liste_personnes', {}, {reload: true});
                });
            }
        });
        $urlRouterProvider.otherwise('/home');
});

personneApp.controller('listePersonnesController', function ($scope, personnes) {
    $scope.personnes = personnes;
});

personneApp.controller('editPersonneController', function ($scope, $stateParams, $state, WebService, personne) {
    if ($stateParams.id != null) {
        $scope.personne = personne;
    }
    $scope.sauve = function() {
        if ($scope.personne.id == null) {
            WebService.insert($scope.personne, function() {
                $scope.success = true;
            });
        } else {
            WebService.update($scope.personne, function() {
                $state.go('liste_personnes', {}, {reload: true});
            });
        }
    };
});


personneApp.controller('detailPersonneController', function ($scope, personne) {
    $scope.personne = personne;
});

personneApp.factory('myUI', function($document) {
    return {
        center : function() {
            var w = $document.width() /2;
            var h = $document.height() / 2;
            return {
                left: w/2,
                top: h/2,
                width: w,
                height: h
            };
        }
    };
});

personneApp.factory('WebService', function ($http) {
    return {
        delete: function(id, success_handler) {
            $http
                .delete('http://localhost:3333/personne/' + id)
                .success(function (data, status, headers, config) {
                    success_handler();
                })
        },
        update: function(personne, success_handler) {
            $http
        .put('http://localhost:3333/personne/' + personne.id, personne)
        .success(function (data, status, headers, config) {
            success_handler();
        });
        },
        insert: function(personne, success_handler) {
            $http
                .post('http://localhost:3333/personne', personne)
                .success(function (data, status, headers, config) {
                    success_handler();
                });
        },
        appel: function (service, success_handler) {
            $http
                .get('http://localhost:3333/' + service)
                .success(function (data, status, headers, config) {
                    success_handler(data);
                });
        }
    };
});
