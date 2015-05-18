var messageApp = angular.module('messageApp', ['ui.router'])
    .run(function ($rootScope, myUI) {
        $rootScope.myUI = myUI.center();
    });

messageApp.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/home'
        })
        .state('liste_personnes', {
            url: '/personnes_liste',
            templateUrl: 'views/personne/listepersonnes',
            controller: 'listePersonnesController',
            resolve: {
                personnes: function ($q, WebService) {
                    var deferred = $q.defer();
                    WebService.appel('personnes', function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('liste_personnes.detail', {
            url: '/detail/{id}',
            templateUrl: 'views/personne/detailpersonne',
            controller: 'detailPersonneController',
            resolve: {
                personne: function ($q, $stateParams, WebService) {
                    var deferred = $q.defer();
                    WebService.appel('personne/' + $stateParams.id, function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
 /*       .state('liste_personnes.create', {
            url: '/create',
            templateUrl: 'views/personne/editpersonne',
            controller: 'editPersonneController'
        })
        */
        .state('liste_personnes.edit', {
            url: '/edit/{id}',
            templateUrl: 'views/personne/editpersonne',
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
            controller: function ($stateParams, $state, WebService) {
                WebService.deletePersonne($stateParams.id, function () {
                    $state.go('liste_personnes', {}, {reload: true});
                });
            }
        })
    .state('liste_messages', {
            url: '/messages_liste',
            templateUrl: 'views/message/listemessages',
            controller: 'listeMessagesController',
            resolve: {
                messages: function($q, WebService) {
                    var deferred = $q.defer();
                    WebService.appel('messages', function (data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('liste_messages.detail', {
            url: '/detail/{id}',
            templateUrl: 'views/message/detailmessage',
            controller: 'detailMessageController',
            resolve: {
                message: function ($q, $stateParams, WebService) {
                   
                    var deferred = $q.defer();
                    WebService.appel('message/' + $stateParams.id, function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('liste_messages.create', {
            url: '/create',
            templateUrl: 'views/message/editmessage',
            controller: 'editMessageController'
        })
        .state('liste_messages.comment', {
            url: '/create',
            templateUrl: 'views/message/editmessage',
            controller: 'editMessageController'
        })
        .state('liste_messages.edit', {
            url: '/edit/{id}',
            templateUrl: 'views/message/editmessage',
            controller: 'editMessageController',
            resolve: {
                message: function($q, $stateParams, WebService) {
                    var deferred = $q.defer();
                    WebService.appel('message/' + $stateParams.id, function(data) {
                        deferred.resolve(data);
                    });
                    return deferred.promise;
                }
            }
        })
        .state('liste_messages.delete', {
            url: '/delete/{id}',
            controller: function($stateParams, $state, WebService) {
                WebService.deleteMessage($stateParams.id, function() {
                    $state.go('liste_messages', {}, {reload: true});
                });
            }
        });
        $urlRouterProvider.otherwise('/home');
});

messageApp.controller('listeMessagesController', function ($scope, messages) {
    $scope.messages = messages;
});

messageApp.controller('editMessageController', function ($scope, $stateParams, $state, WebService) {
    if ($stateParams.id != null) {
         WebService.appel('message/' + $stateParams.id, function(data) {
            $scope.message = data;
        });
    }
    $scope.sauve = function() {
        if ($scope.message.id == null) {
            WebService.insertMessage($scope.message, function() {
                $scope.success = true;
            });
        } else {
            WebService.updateMessage($scope.message, function() {
                $state.go('liste_messages', {}, {reload: true});
            });
        }
    };
});


messageApp.controller('detailMessageController', function ($scope, message) {
    $scope.message = message;
});

messageApp.controller('listePersonnesController', function ($scope, personnes) {
    $scope.personnes = personnes;
});

messageApp.controller('editPersonneController', function ($scope, $stateParams, $state, WebService, personne) {
    if ($stateParams.id != null) {
        $scope.personne = personne;
    }
    $scope.sauve = function() {
        if ($scope.personne.id == null) {
            WebService.insertPersonne($scope.personne, function() {
                $scope.success = true;
            });
        } else {
            WebService.updatePersonne($scope.personne, function() {
                $state.go('liste_personnes', {}, {reload: true});
            });
        }
    };
});


messageApp.controller('detailPersonneController', function ($scope, personne) {
    $scope.personne = personne;
});

messageApp.factory('myUI', function() {
    return {
        center : function() {
            var w = $(document).width() /2;
            var h = $(document).height() / 2;
            return {
                left: w/2,
                top: h/2,
                width: w,
                height: h +50
            };
        }
    };
});

messageApp.factory('WebService', function ($http) {
    return {
        deletePersonne: function(id, success_handler) {
            $http
                .delete('http://localhost:3333/api/personne/' + id)
                .success(function (data, status, headers, config) {
                    success_handler();
                })
        },
        deleteMessage: function(id, success_handler) {
            $http
                .delete('http://localhost:3333/api/message/' + id)
                .success(function (data, status, headers, config) {
                    success_handler();
                })
        },        
        updatePersonne: function(personne, success_handler) {
            $http
        .put('http://localhost:3333/api/personne/' + personne.id, personne)
        .success(function (data, status, headers, config) {
            success_handler();
        });
        },
        updateMessage: function(message, success_handler) {
            $http
        .put('http://localhost:3333/api/message/' + message.id, message)
        .success(function (data, status, headers, config) {
            success_handler();
        });
        },
        insertPersonne: function(personne, success_handler) {
            $http
                .post('http://localhost:3333/api/personne', personne)
                .success(function (data, status, headers, config) {
                    success_handler();
                });
        },
        insertMessage: function(message, success_handler) {
            $http
                .post('http://localhost:3333/api/message', message)
                .success(function (data, status, headers, config) {
                    success_handler();
                });
        },
        appel: function (service, success_handler) {
            $http
                .get('http://localhost:3333/api/' + service)
                .success(function (data, status, headers, config) {
                    success_handler(data);
                });
        }
    };
});
