class FusenNotFoundError(Exception):
    '''付箋がDBに存在しない場合に発生する例外'''
    pass
class ValidationError(Exception):
    """入力値が不正な場合に発生する例外"""
    pass